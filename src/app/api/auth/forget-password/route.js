import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import User from "@/models/User";
import OTP from "@/models/OTP";
import { sendEmail, generateOTP } from "@/lib/email";

export async function POST(request) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide your email address",
        },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectMongo();

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "No account found with this email address.",
        },
        { status: 404 }
      );
    }

    // Check if user registered with credentials (has password)
    if (!user.password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This account was created using social login. Please use Google or Facebook to sign in.",
        },
        { status: 400 }
      );
    }

    // Check for rate limiting - max 3 OTPs per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentOtps = await OTP.countDocuments({
      email: email.toLowerCase(),
      purpose: "password_reset",
      createdAt: { $gte: oneHourAgo },
    });

    if (recentOtps >= 3) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Too many password reset attempts. Please try again after 1 hour.",
        },
        { status: 429 }
      );
    }

    // Delete any existing OTPs for this email and purpose
    await OTP.deleteMany({
      email: email.toLowerCase(),
      purpose: "password_reset",
    });

    // Generate new OTP
    const otp = generateOTP();

    // Save OTP to database
    await OTP.create({
      email: email.toLowerCase(),
      otp: otp,
      purpose: "password_reset",
    });

    // Send password reset email
    const emailResult = await sendEmail(email, "password_reset", {
      name: user.name,
      otp: otp,
    });

    if (!emailResult.success) {
      console.error("Failed to send password reset email:", emailResult.error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send reset email. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Password reset OTP sent to your email. Please check your inbox.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in forget password:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to process password reset. Please try again.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
