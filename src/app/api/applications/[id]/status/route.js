import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import Application from "@/models/SellerApplication";
import User from "@/models/User";
import Store from "@/models/Store";
import connectMongo from "@/lib/mongoose";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify admin role
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      );
    }

    await connectMongo();

    const { status, adminNotes, reason } = await request.json();

    // Validate status
    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    // Get the application
    const application = await Application.findById(id);

    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }

    // Update application
    application.status = status;
    application.adminNotes = adminNotes;
    application.reviewedBy = session.user.id;
    application.reviewedAt = new Date();

    if (status === "rejected") {
      application.reason = reason || adminNotes;
      application.resubmissionAllowed = true; // Allow resubmission by default
    }

    await application.save();

    // If approved, update user role to seller and create Store if not exists
    if (status === "approved") {
      await User.findByIdAndUpdate(application.user, { role: "seller" });

      // Check if store already exists for this user
      let store = await Store.findOne({ owner: application.user });
      if (!store) {
        // Create store with immutable details from application
        const appData = application.applicationData;
        store = await Store.create({
          owner: application.user,
          name: appData.businessName,
          description: appData.businessDescription,
          businessType: appData.businessType,
          location: {
            address: appData.location?.address,
            coordinates: appData.location?.coordinates,
            formattedAddress: appData.location?.formattedAddress,
            placeId: appData.location?.placeId,
          },
          serviceRadius: appData.serviceRadius,
          address: appData.businessAddress,
          landmark: appData.landmark,
          email: appData.businessEmail,
          phone: appData.businessPhone,
          secondaryPhones: appData.secondaryPhones,
          whatsappNumbers: appData.whatsappNumbers,
          website: appData.businessWebsite,
          productCategories: appData.productCategories,
          offers: appData.offers,
          bannerImage: appData.titleImage,
          socialLinks: appData.socialMedia,
          originalApplication: application._id,
          isActive: true,
          isVerified: true,
          approvedAt: new Date(),
        });
        // Optionally, link store to user
        await User.findByIdAndUpdate(application.user, { store: store._id });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Application ${status} successfully`,
      application,
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
