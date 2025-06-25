import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import SellerApplication from "@/models/SellerApplication";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const approvedSellers = await SellerApplication.find({
      status: "approved",
    })
      .populate("user", "name email phone createdAt")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      sellers: approvedSellers,
    });
  } catch (error) {
    console.error("Error fetching approved sellers:", error);
    return NextResponse.json(
      { error: "Failed to fetch approved sellers" },
      { status: 500 }
    );
  }
}
