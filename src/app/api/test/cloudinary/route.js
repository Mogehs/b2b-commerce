import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function GET() {
  try {
    // Test Cloudinary configuration
    const config = cloudinary.config();

    if (!config.cloud_name || !config.api_key || !config.api_secret) {
      return NextResponse.json(
        {
          success: false,
          message: "Cloudinary configuration is missing",
          config: {
            cloud_name: !!config.cloud_name,
            api_key: !!config.api_key,
            api_secret: !!config.api_secret,
          },
        },
        { status: 500 }
      );
    }

    // Test Cloudinary connection
    const result = await cloudinary.api.ping();

    return NextResponse.json({
      success: true,
      message: "Cloudinary connection successful",
      status: result.status,
      cloud_name: config.cloud_name,
    });
  } catch (error) {
    console.error("Cloudinary test error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Cloudinary connection failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
