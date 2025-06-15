import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import dbConnect from "@/lib/mongoose";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import User from "@/models/User";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "20");

    await dbConnect();

    // Find all conversations where the user is a participant
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate({
        path: "participants",
        select: "name email image",
        match: { _id: { $ne: userId } }, // Only populate other participants
      })
      .populate("product", "name images")
      .populate("lastMessage")
      .populate("rfq")
      .sort({ updatedAt: -1 })
      .limit(limit);

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Conversations fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
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

    const { receiverId, initialMessage, productId } = await req.json();

    if (!receiverId) {
      return NextResponse.json(
        { error: "Receiver ID is required" },
        { status: 400 }
      );
    }

    const senderId = session.user.id;

    // Don't allow creating a conversation with yourself
    if (senderId === receiverId) {
      return NextResponse.json(
        { error: "Cannot create conversation with yourself" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return NextResponse.json(
        { error: "Receiver not found" },
        { status: 404 }
      );
    }

    // Check if a conversation already exists between these users
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
      ...(productId ? { product: productId } : {}),
    });

    // If no conversation exists, create one
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        ...(productId ? { product: productId } : {}),
        type: productId ? "rfq" : "general",
      });
    }

    // If there's an initial message, create it
    let message;
    if (initialMessage) {
      message = await Message.create({
        conversation: conversation._id,
        sender: senderId,
        content: initialMessage,
        messageType: "text",
      });

      // Update conversation with last message
      await Conversation.findByIdAndUpdate(conversation._id, {
        lastMessage: message._id,
      });
    }

    return NextResponse.json({
      success: true,
      conversationId: conversation._id,
      messageId: message?._id,
    });
  } catch (error) {
    console.error("Conversation creation error:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
