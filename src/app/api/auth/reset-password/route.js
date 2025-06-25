import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectMongo from "@/lib/mongoose";
import User from "@/models/User";
import OTP from "@/models/OTP";

export async function POST(request) {
  try {
    const { email, resetToken, newPassword } = await request.json();

    // Validate input
    if (!email || !resetToken || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide email, reset token, and new password",
        },
        { status: 400 }
      );
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters long",
        },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectMongo();

    // Find user with valid reset token
    const user = await User.findOne({
      email: email.toLowerCase(),
      passwordResetToken: resetToken,
      passwordResetExpiresAt: { $gt: new Date() }, // Token not expired
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid or expired reset token. Please request a new password reset.",
        },
        { status: 400 }
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password and clear reset token
    await User.updateOne(
      { _id: user._id },
      {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiresAt: null,
        failedLoginAttempts: 0, // Reset failed login attempts
        accountLockedUntil: null, // Unlock account if it was locked
        lastLoginAt: null, // Clear last login to force fresh login
      }
    );

    // Delete all OTPs for this user (cleanup)
    await OTP.deleteMany({
      email: email.toLowerCase(),
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Password reset successfully! You can now log in with your new password.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in reset password:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to reset password. Please try again.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
