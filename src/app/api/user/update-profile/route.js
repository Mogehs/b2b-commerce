import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import User from "@/models/User";
import connectMongo from "@/lib/mongoose";

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await connectMongo();

    // Get request body
    const { name, profile } = await req.json();

    // Validate input
    if (!name) {
      return Response.json({ message: "Name is required" }, { status: 400 });
    }
    // Find user by email instead of ID to handle OAuth users
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    // Update user details
    user.name = name;

    // Update profile fields if they exist
    if (!user.profile) {
      user.profile = {};
    }

    if (profile) {
      // Only update provided fields
      if (profile.whatsapp !== undefined)
        user.profile.whatsapp = profile.whatsapp;
      if (profile.phone !== undefined) user.profile.phone = profile.phone;
    }

    // Save changes
    await user.save();

    // Update session data (will be reflected on next page load)
    return Response.json(
      {
        message: "Profile updated successfully",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          profile: user.profile,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return Response.json(
      { message: "Failed to update profile", error: error.message },
      { status: 500 }
    );
  }
}
