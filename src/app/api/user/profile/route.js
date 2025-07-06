import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import User from "@/models/User";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";
import connectMongo from "@/lib/mongoose";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await connectMongo();

    // Find user by email
    const user = await User.findOne({ email: session.user.email })
      .populate({
        path: "conversations",
        select: "_id participants",
        populate: {
          path: "participants",
          select: "_id name email image",
        },
      })

      .lean();

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    // Count unread messages
    let unreadMessageCount = 0;
    if (user.conversations && user.conversations.length > 0) {
      for (const conversation of user.conversations) {
        const count = await Message.countDocuments({
          conversationId: conversation._id,
          receiver: user._id,
          read: false,
        });
        unreadMessageCount += count;
      }
    }

    // Return user data with profile info
    return Response.json(
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          profile: user.profile || {},
          provider: user.provider,
          role: user.role,
          createdAt: user.createdAt,
          conversations: user.conversations || [],
          unreadMessages: unreadMessageCount,
          favProducts: user.favProducts || [],
          favSellers: user.favSellers || [],
          reviews: user.reviews || [],
          rfqs: user.rfqs || [],
          purchaseHistory: user.purchaseHistory || [],
          hasPassword: Boolean(user.password), // Add password status
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return Response.json(
      { message: "Failed to fetch profile", error: error.message },
      { status: 500 }
    );
  }
}
