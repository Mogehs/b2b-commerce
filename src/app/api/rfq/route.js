import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import RFQ from "@/models/RFQ";
import User from "@/models/User";
import Product from "@/models/Product";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    await dbConnect();

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

    const { productId, sellerId, quantity } = await req.json();

    if (!productId || !sellerId || !quantity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    const buyerId = session.user.id;
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Create a new conversation
    const conversation = await Conversation.create({
      participants: [buyerId, sellerId],
      product: productId,
      type: "rfq",
    });

    // Create the RFQ
    const rfq = await RFQ.create({
      buyer: buyerId,
      seller: sellerId,
      product: productId,
      productName: product.name,
      quantity,
      conversation: conversation._id,
    });

    // Update conversation with rfq reference
    await Conversation.findByIdAndUpdate(conversation._id, {
      rfq: rfq._id,
    });

    // Create initial message
    const initialMessage = await Message.create({
      conversation: conversation._id,
      sender: buyerId,
      content: JSON.stringify({
        productId,
        productName: product.name,
        quantity,
      }),
      messageType: "rfq",
    });

    // Update conversation with last message
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
