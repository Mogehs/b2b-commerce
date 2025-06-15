import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import RFQ from "@/models/RFQ";
import { getIO } from "@/lib/socket";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rfqId = params.id;
    await dbConnect();

    const rfq = await RFQ.findById(rfqId)
      .populate("buyer", "name email image")
      .populate("seller", "name email image")
      .populate("product", "name images price")
      .populate("conversation");

    if (!rfq) {
      return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
    }

    // Verify the user is either the buyer or seller
    const userId = session.user.id;
    if (
      rfq.buyer._id.toString() !== userId &&
      rfq.seller._id.toString() !== userId
    ) {
      return NextResponse.json(
        { error: "You do not have permission to access this RFQ" },
        { status: 403 }
      );
    }

    return NextResponse.json({ rfq });
  } catch (error) {
    console.error("RFQ fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch RFQ details" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rfqId = params.id;
    const { status, price, note } = await req.json();

    await dbConnect();

    const rfq = await RFQ.findById(rfqId).populate("conversation");

    if (!rfq) {
      return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
    }

    // Verify the user is the seller
    const userId = session.user.id;
    if (rfq.seller.toString() !== userId) {
      return NextResponse.json(
        { error: "Only the seller can update the RFQ status" },
        { status: 403 }
      );
    }

    // Update RFQ status
    rfq.status = status;
    await rfq.save();

    // If the status update is a quote submission
    if (status === "Quoted" && price) {
      // Create a quote message
      const quoteMessage = await Message.create({
        conversation: rfq.conversation._id,
        sender: userId,
        content: JSON.stringify({
          productId: rfq.product.toString(),
          price,
          quantity: rfq.quantity,
          note: note || "",
        }),
        messageType: "quote",
      });

      // Update conversation with last message
      await Conversation.findByIdAndUpdate(rfq.conversation._id, {
        lastMessage: quoteMessage._id,
      });

      // If socket.io is available, emit the update
      try {
        const io = getIO();
        io.to(rfq.conversation._id.toString()).emit(
          "receive-message",
          quoteMessage
        );
        io.to(rfq.conversation._id.toString()).emit("quote-updated", {
          conversationId: rfq.conversation._id,
          status: "Quoted",
        });
      } catch (error) {
        console.error("Socket notification failed:", error);
      }
    }

    return NextResponse.json({
      success: true,
      rfq,
    });
  } catch (error) {
    console.error("RFQ update error:", error);
    return NextResponse.json(
      { error: "Failed to update RFQ" },
      { status: 500 }
    );
  }
}
