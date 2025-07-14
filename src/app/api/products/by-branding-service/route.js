import connectMongo from "@/lib/mongoose";
import Product from "@/models/Product";
import Store from "@/models/Store";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectMongo();

    // Get the URL to extract query params
    const url = new URL(request.url);
    const service = url.searchParams.get("service");
    const limit = parseInt(url.searchParams.get("limit")) || 20;

    if (!service) {
      return NextResponse.json(
        { message: "Service parameter is required" },
        { status: 400 }
      );
    }

    // First, find all stores that offer the specified branding service
    const storesWithService = await Store.find({
      brandingServices: { $in: [service] },
      isActive: true,
      isVerified: true,
    }).select("owner");

    // Extract the owner IDs (which are the seller IDs)
    const sellerIds = storesWithService.map((store) => store.owner);

    // Find products from these sellers
    const products = await Product.find({
      seller: { $in: sellerIds },
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("seller", "name email");

    return NextResponse.json(
      {
        products,
        service,
        count: products.length,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch Products by Branding Service Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
