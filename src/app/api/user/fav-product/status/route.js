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

        const { productId } = await req.json();
        const user = await User.findById(session.user.id);

        const isFavorited = user.favProducts.includes(productId);

        return new Response(JSON.stringify({ favorited: isFavorited }), { status: 200 });
    } catch (error) {
        console.error("Fav check error:", error);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}
