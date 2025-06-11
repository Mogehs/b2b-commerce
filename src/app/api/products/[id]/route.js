import connectMongo from "@/lib/mongoose";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        const id = (await params).id;

        await connectMongo();


        const product = await Product.findById(id).populate("seller", "name email");

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ product }, { status: 200 });
    } catch (error) {
        console.error("Get Product By ID Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
