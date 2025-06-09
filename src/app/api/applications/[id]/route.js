import { NextResponse } from "next/server";
import Application from "@/models/SellerApplication";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import connectMongo from "@/lib/mongoose";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const isAdmin = session.user.role === "admin";
    const isOwner = session.user.id && session.user.id.toString() === id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      );
    }

    await connectMongo();

    const application = await Application.findById(id).lean();

    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    if (session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      );
    }

    await connectMongo();

    const data = await request.json();
    const { status, notes } = data;

    const application = await Application.findById(id);

    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }

    // Update application status and notes
    application.status = status || application.status;
    application.notes = notes || application.notes;
    await application.save();

    if (status === "Approved" && application.userId) {
      await User.findByIdAndUpdate(application.userId, { role: "seller" });
    }

    return NextResponse.json({
      success: true,
      message: `Application ${status.toLowerCase()} successfully`,
      application,
    });
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
