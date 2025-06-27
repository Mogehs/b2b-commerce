import { v2 as cloudinary } from "cloudinary";

// Validate environment variables
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.error("Missing Cloudinary environment variables");
  throw new Error(
    "Cloudinary configuration is missing required environment variables"
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Force HTTPS
});

export const uploadToCloudinary = async (
  fileBuffer,
  folder = "b2b-commerece/seller-applications",
  options = {}
) => {
  return new Promise((resolve, reject) => {
    // Validate input
    if (!fileBuffer || fileBuffer.length === 0) {
      reject(new Error("Invalid file buffer provided"));
      return;
    }

    const uploadOptions = {
      resource_type: "auto",
      folder: folder,
      transformation: [
        { width: 1200, height: 900, crop: "limit" },
        { quality: "auto:good" },
        { format: "auto" },
      ],
      timeout: 60000, // 60 seconds timeout
      ...options,
    };

    console.log(
      `Uploading to Cloudinary - Folder: ${folder}, Size: ${fileBuffer.length} bytes`
    );

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error details:", {
            message: error.message,
            http_code: error.http_code,
            error: error,
          });
          reject(
            new Error(
              `Image upload failed: ${error.message || "Unknown error"}`
            )
          );
        } else {
          console.log("Cloudinary upload successful:", {
            public_id: result.public_id,
            url: result.secure_url,
            format: result.format,
            bytes: result.bytes,
          });
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
          });
        }
      }
    );

    // Handle stream errors
    uploadStream.on("error", (error) => {
      console.error("Upload stream error:", error);
      reject(new Error(`Upload stream failed: ${error.message}`));
    });

    uploadStream.end(fileBuffer);
  });
};

export const uploadMultipleToCloudinary = async (
  files,
  folder = "seller-applications"
) => {
  try {
    const uploadPromises = files.map((file) => {
      return uploadToCloudinary(file.buffer, folder, {
        public_id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      });
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Multiple upload error:", error);
    throw error;
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== "ok") {
      throw new Error(`Failed to delete image: ${result.result}`);
    }
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};

export const deleteMultipleFromCloudinary = async (publicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    console.error("Error deleting multiple from Cloudinary:", error);
    throw error;
  }
};

export default cloudinary;
