import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import Store from "@/models/Store";
import connectMongo from "@/lib/mongoose";
import mongoose from "mongoose";

// GET: Fetch the seller's store profile
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

    const store = await Store.findOne({ owner: userId }).lean();
    if (!store) {
      return NextResponse.json(
        { success: false, message: "Store not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, store });
  } catch (err) {
    console.error("Error fetching store profile:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch store profile" },
      { status: 500 }
    );
  }
}

// PUT: Update the seller's store profile
export async function PUT(req) {
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

    const store = await Store.findOne({ owner: userId });
    if (!store) {
      return NextResponse.json(
        { success: false, message: "Store not found" },
        { status: 404 }
      );
    }

    const data = await req.json();
    // Fields that are allowed to be updated
    const allowedFields = [
      "name",
      "description",
      "businessType",
      "businessLegalStatus",
      "yearEstablished",
      "typeOfProducts",
      "mainMarkets",
      "yearlyRevenue",
      "address",
      "landmark",
      "email",
      "phone",
      "secondaryPhones",
      "whatsappNumbers",
      "website",
      "productCategories",
      "offers",
      "socialLinks",
      "certifications",
    ];

    // Only update allowed fields
    allowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        // Handle nested fields like socialLinks and certifications
        if (
          (field === "socialLinks" || field === "certifications") &&
          typeof data[field] === "object"
        ) {
          store[field] = {
            ...store[field],
            ...data[field],
          };
        } else {
          store[field] = data[field];
        }
      }
    });

    await store.save();

    return NextResponse.json({
      success: true,
      message: "Store profile updated successfully",
      store: store.toObject(),
    });
  } catch (err) {
    console.error("Error updating store profile:", err);
    return NextResponse.json(
      { success: false, message: "Failed to update store profile" },
      { status: 500 }
    );
  }
}
