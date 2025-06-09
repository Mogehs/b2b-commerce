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
    const { oldPassword, newPassword } = await req.json();

    // Validate input
    if (!oldPassword || !newPassword) {
      return Response.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return Response.json(
        { message: "New password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Find user by email instead of ID
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    // Check if user can change password (must be credentials provider)
    if (user.provider !== "credentials") {
      return Response.json(
        {
          message:
            "Password can only be changed for accounts with email/password login",
        },
        { status: 400 }
      );
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return Response.json(
        { message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    return Response.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating password:", error);
    return Response.json(
      { message: "Failed to update password", error: error.message },
      { status: 500 }
    );
  }
}
