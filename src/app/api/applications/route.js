import { NextResponse } from "next/server";
import Application from "@/models/SellerApplication";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import connectMongo from "@/lib/mongoose";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }
    console.log("Session:", session);

    if (session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      );
    }

    await connectMongo();

    const applications = await Application.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const data = await request.json();

    await connectMongo();

    const existingApplication = await Application.findOne({
      email: session.user.email,
      status: "Pending",
    });

    if (existingApplication) {
      return NextResponse.json(
        { success: false, message: "You already have a pending application" },
        { status: 400 }
      );
    }

    const application = new Application({
      ...data,
      email: session.user.email,
      userId: session.user.id,
    });

    await application.save();

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
