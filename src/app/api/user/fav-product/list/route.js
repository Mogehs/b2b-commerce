import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import connectMongo from "@/lib/mongoose";
import User from "@/models/User";
import Product from "@/models/Product";

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

    const favoriteProducts = await Product.find({
      _id: { $in: user.favProducts },
      isActive: true,
    })
      .populate("seller", "name")
      .lean();

    const formattedProducts = favoriteProducts.map((product) => ({
      id: product._id,
      title: product.name,
      price: product.price,
      qty: product.minOrderQuantity || 0,
      company: product.seller?.name || "Unknown Seller",
      location: product.placeOfOrigin || "",
      image:
        product.images && product.images.length > 0
          ? product.images[0].url
          : "/dashboardproduct/p1.jpg",
    }));

    return NextResponse.json({
      success: true,
      products: formattedProducts,
    });
  } catch (error) {
    console.error("Fetch Favorite Products Error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
