import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import connectMongo from "@/lib/mongoose";
import User from "@/models/User";
import Store from "@/models/Store";

export async function GET(req) {
  try {
    await connectMongo();

    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found in session" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId).lean();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const favoriteSellers = await Store.find({
      owner: { $in: user.favSellers },
      isActive: true,
    }).lean();

    // Group sellers by business type or product category
    const groupedSellers = {};

    favoriteSellers.forEach((seller) => {
      const groupKey = seller.businessType || "Other";

      if (!groupedSellers[groupKey]) {
        groupedSellers[groupKey] = [];
      }

      groupedSellers[groupKey].push({
        id: seller._id,
        ownerId: seller.owner,
        name: seller.name,
        location: seller.address || "",
        rating: seller.rating || 4,
        reviewCount: seller.reviewCount || 0,
        businessType: seller.businessType || "",
        productCategories: seller.typeOfProducts || "",
        capabilities: seller.capabilities || [],
      });
    });

    return NextResponse.json({
      success: true,
      groupedSellers: groupedSellers,
    });
  } catch (error) {
    console.error("Fetch Favorite Sellers Error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
