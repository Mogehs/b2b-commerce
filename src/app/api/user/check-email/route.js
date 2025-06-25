import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    await connectMongo();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({
        success: true,
        exists: false,
        emailVerified: false,
        accountLocked: false,
      });
    }

    const isAccountLocked =
      user.accountLockedUntil && user.accountLockedUntil > new Date();

    return NextResponse.json({
      success: true,
      exists: true,
      emailVerified: user.emailVerified || false,
      accountLocked: isAccountLocked,
      provider: user.provider || "credentials",
    });
  } catch (error) {
    console.error("Error checking email:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
