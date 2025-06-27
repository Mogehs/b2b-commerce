import { NextResponse } from "next/server";
import { testCloudinaryConnection } from "@/lib/cloudinary";

export async function GET() {
  try {
    const result = await testCloudinaryConnection();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Cloudinary connection successful",
        data: result.result,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Cloudinary connection failed",
          error: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Cloudinary test error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Cloudinary connection test failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
