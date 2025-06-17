import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import SellerApplication from "@/models/SellerApplication";
import connectMongo from "@/lib/mongoose";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    await connectMongo();
    const userId = mongoose.Types.ObjectId.isValid(session.user.id)
      ? new mongoose.Types.ObjectId(session.user.id)
      : session.user.id;
    const application = await SellerApplication.findOne({
      user: userId,
    }).lean();
    if (!application) {
      return NextResponse.json({ success: true, application: null });
    }

    return NextResponse.json({ success: true, application });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
