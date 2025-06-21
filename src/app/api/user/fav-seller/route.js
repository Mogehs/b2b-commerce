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

        const userId = session.user.id;
        const { sellerId } = await req.json();

        if (!sellerId) return NextResponse.json({ message: 'Seller ID is required' }, { status: 400 });

        const user = await User.findById(userId);
        const alreadyFavorited = user.favSellers.includes(sellerId);

        if (alreadyFavorited) {
            user.favSellers.pull(sellerId);
        } else {
            user.favSellers.push(sellerId);
        }

        await user.save();

        return NextResponse.json({
            success: true,
            favorited: !alreadyFavorited,
            favSellers: user.favSellers,
        });
    } catch (error) {
        console.error('Favorite Seller Error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
