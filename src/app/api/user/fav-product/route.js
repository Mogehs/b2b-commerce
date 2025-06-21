import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/auth';
import connectMongo from '@/lib/mongoose';
import User from '@/models/User';

export async function POST(req) {
    try {
        await connectMongo();

        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const userId = session?.user?.id;

        if (!userId) {
            return NextResponse.json({ message: "User ID not found in session" }, { status: 400 });
        }

        const { productId } = await req.json();

        if (!productId) return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });

        const user = await User.findById(userId);
        const alreadyFavorited = user.favProducts.includes(productId);

        if (alreadyFavorited) {
            user.favProducts.pull(productId);
        } else {
            user.favProducts.push(productId);
        }

        await user.save();

        return NextResponse.json({
            success: true,
            favorited: !alreadyFavorited,
            favProducts: user.favProducts,
        });
    } catch (error) {
        console.error('Favorite Product Error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
