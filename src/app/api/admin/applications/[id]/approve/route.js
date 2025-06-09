import connectMongo from "@/lib/mongoose";
import SellerApplication from "@/models/SellerApplication";
import Store from "@/models/Store";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    await connectMongo();

    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { adminNotes } = await request.json();

    // Find the application
    const application = await SellerApplication.findById(id).populate("user");
    if (!application) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    }

    if (application.status !== "pending") {
      return NextResponse.json(
        { message: "Application is not pending" },
        { status: 400 }
      );
    }

    // Update application status
    application.status = "approved";
    application.reviewedBy = session.user.id;
    application.reviewedAt = new Date();
    application.adminNotes = adminNotes || "";
    await application.save();

    // Create store from application data
    const { applicationData } = application;

    const storeData = {
      owner: application.user._id,
      name: applicationData.businessName,
      description: applicationData.businessDescription,
      businessType: applicationData.businessType,
      location: {
        address: applicationData.location.address,
        coordinates: applicationData.location.coordinates,
        formattedAddress: applicationData.location.formattedAddress,
        placeId: applicationData.location.placeId,
      },
      serviceRadius: applicationData.serviceRadius,
      address: applicationData.businessAddress,
      landmark: applicationData.landmark,
      email: applicationData.businessEmail,
      phone: applicationData.businessPhone,
      secondaryPhones: applicationData.secondaryPhones || [],
      whatsappNumbers: applicationData.whatsappNumbers || [],
      website: applicationData.businessWebsite,
      productCategories: applicationData.productCategories || [],
      offers: applicationData.offers,
      bannerImage: applicationData.titleImage,
      socialLinks: applicationData.socialMedia,
      originalApplication: application._id,
      approvedAt: new Date(),
    };

    const store = new Store(storeData);
    await store.save();

    // Update user role and store reference
    await User.findByIdAndUpdate(application.user._id, {
      role: "seller",
      store: store._id,
    });

    return NextResponse.json(
      {
        message: "Application approved successfully",
        store: {
          id: store._id,
          name: store.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error approving application:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
