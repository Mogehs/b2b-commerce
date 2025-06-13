import connectMongo from "@/lib/mongoose";
import Product from "@/models/Product";
import User from "@/models/User";
import { uploadToCloudinary } from "@/lib/cloudinary";
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
            return NextResponse.json({ message: "Forbidden: Only sellers can create products" }, { status: 403 });
        }

        const formData = await request.formData();

        const name = formData.get("name");
        const brandName = formData.get("brandName");
        const model = formData.get("model");
        const placeOfOrigin = formData.get("placeOfOrigin");
        const price = parseFloat(formData.get("price"));
        const minOrderQuantity = parseInt(formData.get("minOrderQuantity"));
        const description = formData.get("description");
        const category = formData.get("category");

        if (!name || !brandName || !model || !placeOfOrigin || !price || !minOrderQuantity || !description || !category) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const files = formData.getAll("images");

        const uploadPromises = files.map(async (file) => {
            if (file instanceof File) {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const uploaded = await uploadToCloudinary(buffer, "products", {
                    public_id: `product_${user._id}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                });
                return { url: uploaded.url, publicId: uploaded.publicId };
            }
        });

        const images = (await Promise.all(uploadPromises)).filter(Boolean);

        const newProduct = new Product({
            name,
            brandName,
            model,
            placeOfOrigin,
            price,
            minOrderQuantity,
            description,
            category,
            images,
            seller: user._id,
        });

        await newProduct.save();

        return NextResponse.json({ message: "Product created", product: newProduct }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}

