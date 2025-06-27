import connectMongo from "@/lib/mongoose";
import Product from "@/models/Product";
import User from "@/models/User";
import { uploadToCloudinary } from "@/lib/cloudinary";
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

    const formData = await request.formData();

    const fields = [
      "name",
      "brandName",
      "model",
      "placeOfOrigin",
      "price",
      "minOrderQuantity",
      "description",
      "category",
    ];
    fields.forEach((field) => {
      const value = formData.get(field);
      if (value) {
        product[field] = ["price", "minOrderQuantity"].includes(field)
          ? parseFloat(value)
          : value;
      }
    });

    const newImages = [];
    const files = formData.getAll("images");
    for (const file of files) {
      if (file instanceof File) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploaded = await uploadToCloudinary(buffer, "products", {
          public_id: `product_${user._id}_${Date.now()}`,
        });
        newImages.push({ url: uploaded.url, publicId: uploaded.publicId });
      }
    }

    if (newImages.length > 0) {
      product.images = newImages;
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
