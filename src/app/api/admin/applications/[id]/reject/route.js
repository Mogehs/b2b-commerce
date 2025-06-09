import connectMongo from "@/lib/mongoose";
import SellerApplication from "@/models/SellerApplication";
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
    const {
      reason,
      adminNotes,
      allowResubmission = true,
    } = await request.json();

    // Find the application
    const application = await SellerApplication.findById(id);
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
    application.status = "rejected";
    application.reviewedBy = session.user.id;
    application.reviewedAt = new Date();
    application.reason = reason;
    application.adminNotes = adminNotes || "";
    application.resubmissionAllowed = allowResubmission;
    await application.save();

    return NextResponse.json(
      {
        message: "Application rejected successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error rejecting application:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
