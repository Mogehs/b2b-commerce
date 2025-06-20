import Store from "@/models/Store";
import connectMongo from "@/lib/mongoose";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Connect to MongoDB before performing operations
    await connectMongo();

    const seller = await Store.find({ owner: id });
    if (!seller || seller.length === 0) {
      return new Response(JSON.stringify({ message: "Seller not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(seller), { status: 200 });
  } catch (error) {
    console.error("Error fetching seller:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
