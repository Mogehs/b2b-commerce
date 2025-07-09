import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import Store from "@/models/Store";
import User from "@/models/User";

export async function GET(request) {
  try {
    await connectMongo();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;
    const region = searchParams.get("region");
    const category = searchParams.get("category");
    const service = searchParams.get("service"); // Add service filter
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build filter object
    const filter = {
      isActive: true,
      isVerified: true,
    };

    // Add region filter if provided
    if (region && region !== "all") {
      filter["location.formattedAddress"] = { $regex: region, $options: "i" };
    }

    // Add category filter if provided
    if (category && category !== "all") {
      filter.productCategories = { $in: [category] };
    }

    // Add branding service filter if provided
    if (service && service !== "all") {
      filter.brandingServices = { $in: [service] };
    }

    // Add search filter if provided
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { businessType: { $regex: search, $options: "i" } },
        { typeOfProducts: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Get stores with owner information
    const stores = await Store.find(filter)
      .populate({
        path: "owner",
        select: "name email profile.phone profile.company image",
      })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalStores = await Store.countDocuments(filter);

    // Get unique regions for filter options
    const regions = await Store.distinct("location.formattedAddress", {
      isActive: true,
      isVerified: true,
    });

    // Get unique categories for filter options
    const categories = await Store.distinct("productCategories", {
      isActive: true,
      isVerified: true,
    });

    // Get unique services for filter options
    const services = await Store.distinct("brandingServices", {
      isActive: true,
      isVerified: true,
    });

    // Calculate pagination info
    const totalPages = Math.ceil(totalStores / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json(
      {
        success: true,
        data: {
          stores,
          pagination: {
            currentPage: page,
            totalPages,
            totalStores,
            hasNextPage,
            hasPrevPage,
            limit,
          },
          filters: {
            regions: regions.filter(Boolean).sort(),
            categories: categories.flat().filter(Boolean).sort(),
            services: services.flat().filter(Boolean).sort(),
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching stores:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch stores",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
