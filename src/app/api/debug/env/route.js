import { NextResponse } from "next/server";

export async function GET() {
  try {
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      // Database
      MONGODB_URI: !!process.env.MONGODB_URI,

      // Authentication
      AUTH_SECRET: !!process.env.AUTH_SECRET,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,

      // Cloudinary
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY
        ? process.env.CLOUDINARY_API_KEY.substring(0, 6) + "..."
        : "NOT_SET",
      CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET,

      // OAuth
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
      FACEBOOK_CLIENT_ID: !!process.env.FACEBOOK_CLIENT_ID,
      FACEBOOK_CLIENT_SECRET: !!process.env.FACEBOOK_CLIENT_SECRET,

      // Site URLs
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
    };

    const missing = Object.entries(envCheck)
      .filter(([key, value]) => !value && key !== "NODE_ENV")
      .map(([key]) => key);

    return NextResponse.json({
      success: missing.length === 0,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      missing_variables: missing,
      environment_check: envCheck,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
