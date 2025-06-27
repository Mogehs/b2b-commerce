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
});

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
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

          // Handle specific error types
          let errorMessage = "Unknown error";
          if (error.http_code === 500) {
            errorMessage =
              "Cloudinary server error (500). This could be due to invalid credentials, quota exceeded, or service issues. Please check your Cloudinary account.";
          } else if (error.http_code === 401) {
            errorMessage =
              "Invalid Cloudinary credentials (401). Please check your API key and secret.";
          } else if (error.http_code === 403) {
            errorMessage =
              "Cloudinary access forbidden (403). Please check your account permissions.";
          } else if (error.message) {
            errorMessage = error.message;
          }

          reject(new Error(`Image upload failed: ${errorMessage}`));
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
