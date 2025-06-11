import connectMongo from "@/lib/mongoose";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await connectMongo();

        const products = await Product.find()
            .sort({ createdAt: -1 })
            .populate("seller", "name email");

        return NextResponse.json({ products }, { status: 200 });
    } catch (error) {
        console.error("Fetch All Products Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
