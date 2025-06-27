import connectMongo from "@/lib/mongoose";
import Product from "@/models/Product";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextResponse } from "next/server";

// Create product route:
export async function POST(request) {
  try {
    await connectMongo();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(session.user.id);
    if (!user || user.role !== "seller") {
      return NextResponse.json(
        { message: "Forbidden: Only sellers can create products" },
        { status: 403 }
      );
    }

    const data = await request.json();

    const {
      name,
      brandName,
      model,
      placeOfOrigin,
      price,
      minOrderQuantity,
      description,
      category,
      imageUrls,
    } = data;

    if (
      !name ||
      !brandName ||
      !model ||
      !placeOfOrigin ||
      !price ||
      !minOrderQuantity ||
      !description ||
      !category ||
      !imageUrls ||
      !Array.isArray(imageUrls) ||
      imageUrls.length === 0
    ) {
      return NextResponse.json(
        { message: "Missing required fields or image URLs" },
        { status: 400 }
      );
    }

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

    const validImageUrls = imageUrls.filter((url) => url && validateUrl(url));

    if (validImageUrls.length === 0) {
      return NextResponse.json(
        { message: "At least one valid image URL is required" },
        { status: 400 }
      );
    }

    // Convert URLs to the format expected by the model
    const images = validImageUrls.map((url) => ({
      url: url,
      publicId: null, // Not applicable for external URLs
    }));

    const newProduct = new Product({
      name,
      brandName,
      model,
      placeOfOrigin,
      price: parseFloat(price),
      minOrderQuantity: parseInt(minOrderQuantity),
      description,
      category,
      images,
      seller: user._id,
    });

    await newProduct.save();

    return NextResponse.json(
      { message: "Product created", product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("Product creation error:", {
      message: error.message,
      stack: error.stack,
      userId: session?.user?.id,
    });

    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error.message,
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
