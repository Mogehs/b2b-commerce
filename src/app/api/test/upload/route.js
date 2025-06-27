import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image");

    if (!imageFile || !(imageFile instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "No image file provided",
        },
        { status: 400 }
      );
    }

    console.log("Test upload - File details:", {
      name: imageFile.name,
      size: imageFile.size,
      type: imageFile.type,
    });

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid file type: ${imageFile.type}. Only JPEG, PNG, and WebP are allowed.`,
        },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    if (imageFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          message: "File size must be less than 5MB",
        },
        { status: 400 }
      );
    }

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!buffer || buffer.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to process image file",
        },
        { status: 400 }
      );
    }

    console.log("Test upload - Buffer created, size:", buffer.length);

    const uploadResult = await uploadToCloudinary(buffer, "test-uploads", {
      public_id: `test_${Date.now()}`,
      overwrite: true,
    });

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        bytes: uploadResult.bytes,
      },
    });
  } catch (error) {
    console.error("Test upload error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Upload failed",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
