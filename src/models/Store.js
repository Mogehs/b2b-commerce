import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Basic store information
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    businessType: { type: String, required: true },

    // Location data (from approved application)
    location: {
      address: String,
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true,
        },
      },
      formattedAddress: String,
      placeId: String,
    },
    serviceRadius: {
      type: Number,
      default: 10,
      min: 1,
      max: 100,
    },
    address: { type: String, required: true },
    landmark: { type: String, required: true },

    // Contact information
    email: { type: String, required: true },
    phone: { type: String, required: true },
    secondaryPhones: [String], // phone2, phone3
    whatsappNumbers: [String], // whatsapp, whatsapp2
    website: { type: String },

    // Business details
    productCategories: [{ type: String }], // Changed from products
    offers: { type: String }, // Changed from array to string to match application

    // Media
    bannerImage: {
      url: { type: String, required: true },
      publicId: String,
      width: Number,
      height: Number,
      format: String,
      bytes: Number,
    },

    // Social media
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String,
    },

    // Store status and metadata
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: true, // Set to true when created from approved application
    },
    approvedAt: {
      type: Date,
      default: Date.now,
    },

    // Reference to original application
    originalApplication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SellerApplication",
    },
  },
  { timestamps: true }
);

// Add geospatial index for location-based queries
storeSchema.index({ "location.coordinates": "2dsphere" });
storeSchema.index({ owner: 1 });
storeSchema.index({ isActive: 1 });
storeSchema.index({ productCategories: 1 });

export default mongoose.models.Store || mongoose.model("Store", storeSchema);
