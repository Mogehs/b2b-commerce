import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectMongo from "@/lib/mongoose";
import User from "@/models/User";
import OTP from "@/models/OTP";
import { sendEmail, generateOTP } from "@/lib/email";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide all required fields",
          field: !name ? "name" : !email ? "email" : "password",
        },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectMongo();

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This email address is already registered. Please use another email or login.",
          field: "email",
        },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user object with required fields from schema
    const userData = {
      name,
      email,
      password: hashedPassword,
      provider: "credentials",
      role: "buyer",
      profile: {
        phone: "",
        company: "",
        whatsapp: "",
        address: "",
        country: "",
        website: "",
        description: "",
      },
      favProducts: [],
      favSellers: [],
      reviews: [],
      rfqs: [],
      purchaseHistory: [],
      conversations: [],
    };

    // Create new user
    const newUser = new User(userData);

    // Save user to database
    const savedUser = await newUser.save();

    // Generate OTP for email verification
    const otp = generateOTP();

    // Save OTP to database
    await OTP.create({
      email: savedUser.email,
      otp: otp,
      purpose: "email_verification",
    });

    // Send verification email
    const emailResult = await sendEmail(savedUser.email, "email_verification", {
      name: savedUser.name,
      otp: otp,
    });

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
      // Don't fail registration if email fails, but log it
    }

    // Return success without sensitive info
    return NextResponse.json(
      {
        success: true,
        message:
          "Account created successfully! Please check your email for verification code.",
        user: {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
          role: savedUser.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in signup:", error);

    let errorMessage = "Failed to register user. Please try again.";
    let field = null;

    if (error.name === "ValidationError") {
      errorMessage = "Validation failed. Please check your information.";
      const errorKeys = Object.keys(error.errors);
      if (errorKeys.length > 0) {
        field = errorKeys[0];
        errorMessage = error.errors[field].message;
      }
    } else if (error.code === 11000) {
      errorMessage =
        "This email is already registered. Please use another email.";
      field = "email";
    } else if (error.message.includes("password")) {
      errorMessage = "Password issue: " + error.message;
      field = "password";
    }

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        field: field,
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
