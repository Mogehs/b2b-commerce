import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import User from "@/models/User";
import connectMongo from "@/lib/mongoose";
import bcrypt from "bcryptjs";

export async function PUT(req) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await connectMongo();

    // Get request body
    const { newPassword } = await req.json();

    // Validate input
    if (!newPassword) {
      return Response.json(
        { message: "New password is required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return Response.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    // Check if user already has a password set
    if (user.password) {
      return Response.json(
        {
          message: "Password already exists. Use update password instead.",
        },
        { status: 400 }
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Set password for the first time
    user.password = hashedPassword;
    await user.save();

    return Response.json(
      { message: "Password set successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error setting password:", error);
    return Response.json(
      { message: "Failed to set password", error: error.message },
      { status: 500 }
    );
  }
}
