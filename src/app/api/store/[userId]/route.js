import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Store from "@/models/Store";
import User from "@/models/User";
import { getServerSession } from "next-auth";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Find the store by owner ID
    const store = await Store.findOne({ owner: userId }).lean();

    if (!store) {
      return NextResponse.json(
        { success: false, message: "Store not found for this user" },
        { status: 404 }
      );
    }

    // Get basic user info
    const user = await User.findById(userId).select("name email image").lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Combine store and user data
    const storeData = {
      ...store,
      owner: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    };

    return NextResponse.json({
      success: true,
      store: storeData,
    });
  } catch (error) {
    console.error("Error fetching store:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch store information" },
      { status: 500 }
    );
  }
}
