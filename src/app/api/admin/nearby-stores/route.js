import dbConnect from "@/lib/mongoose";
import Store from "@/models/Store";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userLng = parseFloat(searchParams.get("lng"));
    const userLat = parseFloat(searchParams.get("lat"));
    const radius = parseInt(searchParams.get("radius")) || 5000; // Default 5km
    const limit = parseInt(searchParams.get("limit")) || 50; // Default 50 stores

    let stores = [];
    const projection =
      "_id owner name address location description businessType businessLegalStatus yearEstablished typeOfProducts mainMarkets yearlyRevenue formattedAddress placeId serviceRadius landmark email phone secondaryPhones whatsappNumbers website productCategories offers bannerImage socialLinks certifications isActive isVerified approvedAt originalApplication createdAt updatedAt";

    if (!isNaN(userLng) && !isNaN(userLat)) {
      // Use geospatial query with specified radius
      stores = await Store.find({
        isActive: true,
        isVerified: true,
        "location.coordinates": {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [userLng, userLat],
            },
            $maxDistance: radius, // Use dynamic radius
          },
        },
      })
        .select(projection)
        .limit(limit) // Limit results
        .lean();

      console.log(
        `Found ${stores.length} stores within ${radius}m of [${userLat}, ${userLng}]`
      );
    } else {
      // Fallback: get all active stores if no location provided
      stores = await Store.find({
        isActive: true,
        isVerified: true,
      })
        .select(projection)
        .limit(limit)
        .lean();
    }

    return new Response(
      JSON.stringify({
        stores,
        totalFound: stores.length,
        searchRadius: radius,
        userLocation:
          !isNaN(userLng) && !isNaN(userLat)
            ? { lng: userLng, lat: userLat }
            : null,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate", // Ensure fresh data for real-time updates
        },
      }
    );
  } catch (err) {
    console.error("API Error:", err);
    return new Response(
      JSON.stringify({
        stores: [],
        error: err.message,
        totalFound: 0,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
