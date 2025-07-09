import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    businessType: { type: String, required: true },
    businessLegalStatus: { type: String, default: "Sole Proprietor" },
    yearEstablished: { type: String },
    typeOfProducts: { type: String },
    mainMarkets: [{ type: String }],
    yearlyRevenue: { type: String },

    location: {
      address: String,
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number],
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
    email: { type: String, required: true },
    phone: { type: String, required: true },
    secondaryPhones: [String],
    whatsappNumbers: [String],
    website: { type: String },
    productCategories: [{ type: String }],
    brandingServices: [
      {
        type: String,
        enum: ["Low MOQ", "OEM Services", "Private Labeling", "Ready to Ship"],
      },
    ],
    offers: { type: String },
    bannerImage: {
      url: { type: String },
      publicId: String,
      width: Number,
      height: Number,
      format: String,
      bytes: Number,
    },
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String,
    },
    certifications: {
      nationalTaxNumber: {
        certType: String,
        year: String,
      },
      professionalTax: {
        certType: String,
        year: String,
      },
      iso9001: {
        certType: String,
        year: String,
      },
      chamberOfCommerce: {
        certType: String,
        year: String,
      },
      otherCertifications: [
        {
          name: String,
          year: String,
          documentUrl: String,
        },
      ],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    approvedAt: {
      type: Date,
      default: Date.now,
    },

    originalApplication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SellerApplication",
    },
  },
  { timestamps: true }
);

storeSchema.index({ "location.coordinates": "2dsphere" });
storeSchema.index({ owner: 1 });
storeSchema.index({ name: 1 });
storeSchema.index({ createdAt: -1 });

export default mongoose.models.Store || mongoose.model("Store", storeSchema);
