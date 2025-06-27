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

// Validate credentials format
const cloudName = process.env.CLOUDINARY_CLOUD_NAME.trim();
const apiKey = process.env.CLOUDINARY_API_KEY.trim();
const apiSecret = process.env.CLOUDINARY_API_SECRET.trim();

if (cloudName.length === 0 || apiKey.length === 0 || apiSecret.length === 0) {
  throw new Error("Cloudinary credentials cannot be empty");
}

console.log("Configuring Cloudinary with:", {
  cloud_name: cloudName,
  api_key: apiKey.substring(0, 6) + "...", // Only show first 6 chars for security
  has_secret: !!apiSecret,
  environment: process.env.NODE_ENV
});

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true, // Force HTTPS
  timeout: 120000, // 2 minutes timeout for production
});

export const uploadToCloudinary = async (
  fileBuffer,
  folder = "b2b-commerece/seller-applications",
  options = {}
) => {
  return new Promise((resolve, reject) => {
    // Validate Cloudinary configuration
    if (
      !cloudinary ||
      !cloudinary.uploader ||
      typeof cloudinary.uploader.upload_stream !== "function"
    ) {
      return reject(new Error("Cloudinary is not configured correctly."));
    }

    // Validate input
    if (
      !fileBuffer ||
      !Buffer.isBuffer(fileBuffer) ||
      fileBuffer.length === 0
    ) {
      return reject(new Error("Invalid or empty file buffer provided."));
    }

    // Optional: File size limit check (e.g., 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (fileBuffer.length > MAX_SIZE) {
      return reject(new Error("File size exceeds 10MB limit."));
    }

    const uploadOptions = {
      resource_type: "auto",
      folder: folder,
      transformation: [
        { width: 1200, height: 900, crop: "limit" },
        { quality: "auto:good" },
        { fetch_format: "auto" }, // Changed `format` to `fetch_format` for clarity
      ],
      timeout: 60000, // 60 seconds
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
            error,
          });

          let errorMessage = "Image upload failed: ";

          switch (error.http_code) {
            case 500:
              errorMessage +=
                "Cloudinary server error (500). Check credentials or service status.";
              break;
            case 401:
              errorMessage +=
                "Unauthorized (401). Verify your API key and secret.";
              break;
            case 403:
              errorMessage +=
                "Access forbidden (403). Check your account permissions.";
              break;
            default:
              errorMessage += error.message || "Unknown error occurred.";
          }

          return reject(new Error(errorMessage));
        }

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
    );

    uploadStream.on("error", (streamError) => {
      console.error("Upload stream error:", streamError);
      reject(new Error(`Upload stream failed: ${streamError.message}`));
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

// Test Cloudinary credentials
export const testCloudinaryConnection = async () => {
  try {
    console.log("Testing Cloudinary connection...");

    // Test with a simple API call
    const result = await cloudinary.api.ping();
    console.log("Cloudinary connection test successful:", result);
    return { success: true, result };
  } catch (error) {
    console.error("Cloudinary connection test failed:", {
      message: error.message,
      http_code: error.http_code,
      error: error,
    });

    // Provide specific error messages
    if (error.http_code === 401) {
      return {
        success: false,
        error:
          "Invalid API credentials. Please check your Cloudinary API key and secret.",
      };
    } else if (error.http_code === 403) {
      return {
        success: false,
        error:
          "Access forbidden. Please check your Cloudinary account permissions.",
      };
    } else if (error.http_code === 500) {
      return {
        success: false,
        error:
          "Cloudinary server error. The service might be down or your account might have issues.",
      };
    } else {
      return {
        success: false,
        error: error.message || "Unknown connection error",
      };
    }
  }
};

export default cloudinary;
