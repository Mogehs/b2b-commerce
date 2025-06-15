import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { sellerId } = params;

    if (!sellerId) {
      return NextResponse.json(
        { success: false, message: "Seller ID is required" },
        { status: 400 }
      );
    }

    // Get the URL parameters
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "5");
    const excludeId = url.searchParams.get("excludeId");

    // Create the query
    let query = { seller: sellerId, isActive: true };

    // Exclude current product if excludeId is provided
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    // Get products by seller with populated seller fields
    const products = await Product.find(query)
      .populate("seller", "name email") // Only get necessary seller fields
      .sort({ createdAt: -1 }) // Most recent first
      .limit(limit)
      .lean();

    // Format the response data
    const formattedProducts = products.map((product) => ({
      _id: product._id,
      name: product.name,
      price: product.price,
      minOrderQuantity: product.minOrderQuantity,
      image:
        product.images && product.images.length > 0
          ? product.images[0].url
          : null,
      seller: product.seller ? product.seller.name : "Unknown Seller",
      category: product.category,
      brandName: product.brandName,
    }));

    return NextResponse.json({
      success: true,
      products: formattedProducts,
    });
  } catch (error) {
    console.error("Error fetching seller products:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch seller products" },
      { status: 500 }
    );
  }
}
