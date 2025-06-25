import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import dbConnect from "@/lib/mongoose";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    await dbConnect();

    // Find all conversations where the user is a participant
    const conversations = await Conversation.find({
      participants: userId,
    }).select("_id");

    let totalUnreadCount = 0;
    const conversationUnreadCounts = [];

    // For each conversation, count unread messages
    for (const conversation of conversations) {
      const unreadCount = await Message.countDocuments({
        conversation: conversation._id,
        sender: { $ne: userId }, // Messages not sent by the current user
        read: false,
      });

      totalUnreadCount += unreadCount;

      if (unreadCount > 0) {
        conversationUnreadCounts.push({
          conversationId: conversation._id,
          unreadCount,
        });
      }
    }

    return NextResponse.json({
      totalUnreadCount,
      conversationUnreadCounts,
    });
  } catch (error) {
    console.error("Unread count fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch unread count" },
      { status: 500 }
    );
  }
}
