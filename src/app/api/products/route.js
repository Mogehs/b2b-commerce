import connectMongo from "@/lib/mongoose";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectMongo();

    // Get the URL to extract query params
    const url = new URL(request.url);
    const sellerId = url.searchParams.get("sellerId");
    console.log(sellerId);
    let query = {};

    // If sellerId is provided, filter products by that seller
    if (sellerId) {
      query = { seller: sellerId };
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .populate("seller", "name email");

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Fetch All Products Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
