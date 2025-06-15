import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongoose";
import Store from "@/models/Store";

export async function POST(req) {
  try {
    // Check authentication and admin status
    const session = await getServerSession();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const updates = await req.json();

    // Update all stores with the seed data
    const result = await Store.updateMany(
      {},
      {
        $set: {
          businessLegalStatus: updates.businessLegalStatus || "Sole Proprietor",
          yearEstablished: updates.yearEstablished || "2015",
          typeOfProducts: updates.typeOfProducts || "Various Products",
          mainMarkets: updates.mainMarkets || ["Pakistan"],
          yearlyRevenue: updates.yearlyRevenue || "Not specified",
          certifications: updates.certifications || {
            nationalTaxNumber: { type: "Default", year: "2020" },
            professionalTax: { type: "Default", year: "2020" },
            iso9001: { type: "Default", year: "2020" },
            chamberOfCommerce: { type: "Default", year: "2020" },
          },
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Stores updated successfully",
      count: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error updating stores:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update stores" },
      { status: 500 }
    );
  }
}
