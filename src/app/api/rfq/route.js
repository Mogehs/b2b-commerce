import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import dbConnect from "@/lib/mongoose";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import RFQ from "@/models/RFQ";
import User from "@/models/User";
import Product from "@/models/Product";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userEmail = session.user.email;
    await dbConnect();

    const userDoc = await User.findOne({ email: userEmail });

    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = userDoc._id;

    const searchParams = req.nextUrl.searchParams;
    const role = searchParams.get("role");

    let rfqs;

    if (role === "seller") {
      rfqs = await RFQ.find({ seller: userId })
        .populate("buyer", "name")
        .populate("product", "name images")
        .sort({ createdAt: -1 });
    } else if (role === "buyer") {
      rfqs = await RFQ.find({ buyer: userId })
        .populate("seller", "name")
        .populate("product", "name images")
        .sort({ createdAt: -1 });
    } else {
      return NextResponse.json(
        { error: "Invalid role parameter" },
        { status: 400 }
      );
    }

    return NextResponse.json({ rfqs });
  } catch (error) {
    console.error("RFQ fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch RFQs" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, sellerId, quantity, message } = await req.json();

    if (!productId || !sellerId || !quantity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(productId) ||
      !mongoose.Types.ObjectId.isValid(sellerId)
    ) {
      return NextResponse.json({ error: "Invalid IDs" }, { status: 400 });
    }

    await dbConnect(); // Get buyer ID from session
    const buyerEmail = session.user.email;

    // Find users by identifiable information
    const [product, buyer, seller] = await Promise.all([
      Product.findById(productId),
      User.findOne({ email: buyerEmail }), // Find by email which is unique
      User.findById(sellerId),
    ]);

    if (!product || !buyer || !seller) {
      return NextResponse.json(
        { error: "Invalid product or user" },
        { status: 404 }
      );
    }

    const conversation = await Conversation.create({
      participants: [buyer._id, seller._id],
      product: product._id,
      type: "rfq",
    });

    const rfq = await RFQ.create({
      buyer: buyer._id,
      seller: seller._id,
      product: product._id,
      productName: product.name,
      quantity,
      message: message || "",
      conversation: conversation._id,
    });

    await Conversation.findByIdAndUpdate(conversation._id, {
      rfq: rfq._id,
    });

    const initialMessage = await Message.create({
      conversation: conversation._id,
      sender: buyer._id,
      content: JSON.stringify({
        productId: product._id,
        productName: product.name,
        quantity,
        message: message || "",
      }),
      messageType: "rfq",
    });

    await Conversation.findByIdAndUpdate(conversation._id, {
      lastMessage: initialMessage._id,
    });

    return NextResponse.json({
      success: true,
      rfq,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error("RFQ creation error:", error);
    return NextResponse.json(
      { error: "Failed to create RFQ" },
      { status: 500 }
    );
  }
}
