import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import Message from "@/models/Message";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");
    const lastMessageId = searchParams.get("lastMessageId");

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID required" },
        { status: 400 }
      );
    }

    await connectMongo();

    let query = { conversation: conversationId };

    // If lastMessageId is provided, get messages after that
    if (lastMessageId) {
      query._id = { $gt: lastMessageId };
    }

    const messages = await Message.find(query)
      .populate("sender", "name email")
      .sort({ createdAt: 1 })
      .limit(50);

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      conversationId,
      senderId,
      content,
      messageType = "text",
      quoteDetails,
    } = body;

    if (!conversationId || !senderId || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectMongo();

    const newMessage = await Message.create({
      conversation: conversationId,
      sender: senderId,
      content,
      messageType,
      quoteDetails,
    });

    const populatedMessage = await Message.findById(newMessage._id).populate(
      "sender",
      "name email"
    );

    return NextResponse.json({ message: populatedMessage });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
