import connectMongo from "@/lib/mongoose";
import Product from "@/models/Product";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;

    await connectMongo();

    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await User.findById(session.user.id);
    if (!user || user.role !== "seller")
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const product = await Product.findById(id);
    if (!product || !product.seller.equals(user._id)) {
      return NextResponse.json(
        { message: "Product not found or unauthorized" },
        { status: 404 }
      );
    }

    const data = await request.json();

    // Update basic fields
    const fields = [
      "name",
      "brandName",
      "model",
      "placeOfOrigin",
      "description",
      "category",
    ];

    fields.forEach((field) => {
      if (data[field] !== undefined) {
        product[field] = data[field];
      }
    });

    // Handle numeric fields
    if (data.price !== undefined) {
      product.price = parseFloat(data.price);
    }
    if (data.minOrderQuantity !== undefined) {
      product.minOrderQuantity = parseInt(data.minOrderQuantity);
    }

    // Handle image URLs
    if (data.imageUrls && Array.isArray(data.imageUrls)) {
      // Validate image URLs
      const validateUrl = (url) => {
        try {
          new URL(url);
          const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
          const lowerUrl = url.toLowerCase();
          return (
            imageExtensions.some((ext) => lowerUrl.includes(ext)) ||
            lowerUrl.includes("imgur.com") ||
            lowerUrl.includes("cloudinary.com") ||
            lowerUrl.includes("unsplash.com") ||
            lowerUrl.includes("pexels.com")
          );
        } catch {
          return false;
        }
      };

      const validImageUrls = data.imageUrls.filter(
        (url) => url && validateUrl(url)
      );

      if (validImageUrls.length > 0) {
        product.images = validImageUrls.map((url) => ({
          url: url,
          publicId: null, // Not applicable for external URLs
        }));
      }
    }

    await product.save();

    return NextResponse.json(
      { message: "Product updated", product },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Product Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await connectMongo();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(session.user.id);
    if (!user || user.role !== "seller") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const product = await Product.findById(id);
    if (!product || !product.seller.equals(user._id)) {
      return NextResponse.json(
        { message: "Product not found or unauthorized" },
        { status: 404 }
      );
    }

    await product.deleteOne();

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Product Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
