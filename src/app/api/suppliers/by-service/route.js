import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import Store from "@/models/Store";

export async function GET(request) {
  try {
    await connectMongo();

    const { searchParams } = new URL(request.url);
    const service = searchParams.get("service");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;

    if (!service) {
      return NextResponse.json(
        { success: false, message: "Service parameter is required" },
        { status: 400 }
      );
    }

    // Build filter object
    const filter = {
      isActive: true,
      isVerified: true,
      brandingServices: { $in: [service] },
    };

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get stores with the specified branding service
    const stores = await Store.find(filter)
      .populate({
        path: "owner",
        select: "name email profile.phone profile.company image",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalStores = await Store.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(totalStores / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json(
      {
        success: true,
        data: {
          stores,
          service,
          pagination: {
            currentPage: page,
            totalPages,
            totalStores,
            hasNextPage,
            hasPrevPage,
            limit,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching suppliers by service:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch suppliers" },
      { status: 500 }
    );
  }
}
