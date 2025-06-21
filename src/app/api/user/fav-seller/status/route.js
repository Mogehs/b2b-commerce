import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import connectMongo from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectMongo();
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const { sellerId } = await req.json();
    if (!sellerId) {
      return new Response(JSON.stringify({ message: "Seller ID is required" }), { status: 400 });
    }

    const user = await User.findById(session.user.id);
    const isFavorited = user.favSellers.includes(sellerId);

    return new Response(JSON.stringify({ favorited: isFavorited }), { status: 200 });
  } catch (error) {
    console.error("Fav seller check error:", error);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
