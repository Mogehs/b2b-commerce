import dbConnect from "@/lib/mongoose";
import Store from "@/models/Store";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userLng = parseFloat(searchParams.get("lng"));
    const userLat = parseFloat(searchParams.get("lat"));

    let stores = [];
    const projection =
      "_id name address location description businessType businessLegalStatus yearEstablished typeOfProducts mainMarkets yearlyRevenue formattedAddress placeId serviceRadius landmark email phone secondaryPhones whatsappNumbers website productCategories offers bannerImage socialLinks certifications isActive isVerified approvedAt originalApplication createdAt updatedAt";

    if (!isNaN(userLng) && !isNaN(userLat)) {
      stores = await Store.find({
        isActive: true,
        isVerified: true,
        "location.coordinates": {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [userLng, userLat],
            },
            // $maxDistance: 5000,
          },
        },
      })
        .select(projection)
        .lean();
    } else {
      stores = await Store.find({ isActive: true, isVerified: true })
        .select(projection)
        .lean();
    }
    return new Response(JSON.stringify({ stores }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("API Error:", err);
    return new Response(JSON.stringify({ stores: [], error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
