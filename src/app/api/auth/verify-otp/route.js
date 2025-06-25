import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import User from "@/models/User";
import OTP from "@/models/OTP";

export async function POST(request) {
  try {
    const { email, otp, purpose } = await request.json();

    // Validate input
    if (!email || !otp || !purpose) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide email, OTP, and purpose",
        },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectMongo();

    // Find the OTP record
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      purpose: purpose,
      verified: false,
    }).sort({ createdAt: -1 }); // Get the latest OTP

    if (!otpRecord) {
      return NextResponse.json(
        {
          success: false,
          message: "No valid OTP found. Please request a new one.",
        },
        { status: 404 }
      );
    }

    // Check if OTP has expired
    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        {
          success: false,
          message: "OTP has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    // Check if too many attempts
    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        {
          success: false,
          message: "Too many failed attempts. Please request a new OTP.",
        },
        { status: 429 }
      );
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      // Increment attempts
      await OTP.updateOne({ _id: otpRecord._id }, { $inc: { attempts: 1 } });

      return NextResponse.json(
        {
          success: false,
          message: `Invalid OTP. ${
            5 - (otpRecord.attempts + 1)
          } attempts remaining.`,
        },
        { status: 400 }
      );
    }

    // OTP is valid, mark as verified
    await OTP.updateOne({ _id: otpRecord._id }, { verified: true });

    // Update user based on purpose
    if (purpose === "email_verification") {
      await User.updateOne(
        { email: email.toLowerCase() },
        {
          emailVerified: true,
          emailVerifiedAt: new Date(),
        }
      );

      return NextResponse.json(
        {
          success: true,
          message: "Email verified successfully! You can now log in.",
        },
        { status: 200 }
      );
    } else if (purpose === "password_reset") {
      // Generate a temporary token for password reset
      const resetToken =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      await User.updateOne(
        { email: email.toLowerCase() },
        {
          passwordResetToken: resetToken,
          passwordResetExpiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        }
      );

      return NextResponse.json(
        {
          success: true,
          message: "OTP verified! You can now reset your password.",
          resetToken: resetToken,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid purpose specified.",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in OTP verification:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to verify OTP. Please try again.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// Resend OTP
export async function PUT(request) {
  try {
    const { email, purpose } = await request.json();

    // Validate input
    if (!email || !purpose) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide email and purpose",
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
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    // Delete existing OTPs for this email and purpose
    await OTP.deleteMany({
      email: email.toLowerCase(),
      purpose: purpose,
    });

    // Generate new OTP
    const { generateOTP, sendEmail } = await import("@/lib/email");
    const otp = generateOTP();

    // Save new OTP to database
    await OTP.create({
      email: email.toLowerCase(),
      otp: otp,
      purpose: purpose,
    });

    // Send email based on purpose
    const emailType =
      purpose === "email_verification"
        ? "email_verification"
        : "password_reset";
    const emailResult = await sendEmail(email, emailType, {
      name: user.name,
      otp: otp,
    });

    if (!emailResult.success) {
      console.error("Failed to send email:", emailResult.error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send email. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "New OTP sent to your email.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in resending OTP:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to resend OTP. Please try again.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
