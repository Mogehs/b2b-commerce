import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import SellerApplication from "@/models/SellerApplication";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { id } = params;

    // Update seller status to suspended
    const updatedSeller = await SellerApplication.findByIdAndUpdate(
      id,
      {
        status: "suspended",
        suspendedAt: new Date(),
        suspendedBy: session.user.id,
      },
      { new: true }
    ).populate("user", "name email");

    if (!updatedSeller) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Seller suspended successfully",
      seller: updatedSeller,
    });
  } catch (error) {
    console.error("Error suspending seller:", error);
    return NextResponse.json(
      { error: "Failed to suspend seller" },
      { status: 500 }
    );
  }
}
