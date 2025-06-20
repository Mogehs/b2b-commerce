import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import dbConnect from "@/lib/mongoose";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import { getIO } from "@/lib/socket";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversationId = await params.id;
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");
    const userId = session.user.id;

    await dbConnect();

    const conversation = await Conversation.findById(conversationId)
      .populate({
        path: "participants",
        select: "name email image",
      })
      .populate("product", "name images price")
      .populate("rfq");

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    } // Check if user is a participant - handle both populated and unpopulated cases
    const isParticipant = conversation.participants.some((participant) => {
      // If participants are populated objects with _id
      if (participant._id) {
        return participant._id.toString() === userId;
      }
      // If participants are just IDs (not populated)
      return participant.toString() === userId;
    });

    if (!isParticipant) {
      console.log("User not a participant:", {
        userId,
        participants: conversation.participants.map((p) =>
          p._id ? p._id.toString() : p.toString()
        ),
      });
      return NextResponse.json(
        { error: "You are not a participant in this conversation" },
        { status: 403 }
      );
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "name email image")
      .sort({ createdAt: 1 })
      .limit(limit);

    await Message.updateMany(
      {
        conversation: conversationId,
        sender: { $ne: userId },
        read: false,
      },
      { read: true }
    );

    return NextResponse.json({
      conversation,
      messages,
    });
  } catch (error) {
    console.error("Messages fetch error:", error);
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
    const { content, messageType = "text" } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    const senderId = session.user.id;

    await dbConnect();

    // Verify the conversation exists and user is a participant
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    } // Check if user is a participant - handle both string IDs and ObjectIds
    const isParticipant = conversation.participants.some((participant) => {
      return participant.toString() === senderId;
    });

    if (!isParticipant) {
      return NextResponse.json(
        { error: "You are not a participant in this conversation" },
        { status: 403 }
      );
    }

    // Create the message
    const message = await Message.create({
      conversation: conversationId,
      sender: senderId,
      content,
      messageType,
    });

    // Populate sender information for immediate use
    await message.populate("sender", "name email image");

    // Update conversation with last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
    });

    // If socket.io is available, emit the new message
    try {
      const io = getIO();
      io.to(conversationId).emit("receive-message", message);
    } catch (error) {
      console.error("Socket notification failed:", error);
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Message creation error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
