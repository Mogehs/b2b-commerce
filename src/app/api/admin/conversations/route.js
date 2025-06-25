import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Conversation from "@/models/Conversation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { sellerId, type = "admin_seller" } = await request.json();

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [session.user.id, sellerId] },
      type: type,
    });

    if (!conversation) {
      // Create new conversation
      conversation = new Conversation({
        participants: [session.user.id, sellerId],
        type: type,
        createdBy: session.user.id,
      });
      await conversation.save();
    }

    return NextResponse.json({
      success: true,
      conversationId: conversation._id,
      conversation,
    });
  } catch (error) {
    console.error("Error creating admin conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
