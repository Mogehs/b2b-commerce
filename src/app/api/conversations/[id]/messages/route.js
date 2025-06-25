import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import dbConnect from "@/lib/mongoose";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversationId = await params.id;
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");

    await dbConnect();

    // Verify user has access to this conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(session.user.id)) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "name email image role")
      .sort({ createdAt: 1 })
      .limit(limit);

    return NextResponse.json({
      success: true,
      messages,
      conversation,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversationId = await params.id;
    const { content, type, isAdminMessage = false } = await req.json();

    await dbConnect();

    // Verify user has access to this conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(session.user.id)) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Create the message
    const messageData = {
      conversation: conversationId,
      sender: session.user.id,
      content,
      isAdminMessage,
    };

    // Handle warning messages
    if (
      type &&
      [
        "policy_violation",
        "quality_concern",
        "delivery_issue",
        "final_warning",
      ].includes(type)
    ) {
      messageData.messageType = "warning";
      messageData.warningType = type;
    }

    const message = new Message(messageData);
    await message.save();

    // Populate sender information
    await message.populate("sender", "name email image role");

    // Update conversation's last message
    conversation.lastMessage = message._id;
    await conversation.save();

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
