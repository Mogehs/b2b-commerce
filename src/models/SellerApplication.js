import mongoose from "mongoose";

const sellerApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
    },

    applicationData: {
      businessName: {
        type: String,
        required: true,
        trim: true,
      },
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
        placeId: String,
        formattedAddress: String,
        addressComponents: {
          streetNumber: String,
          route: String,
          locality: String,
          sublocality: String,
          administrativeAreaLevel1: String,
          administrativeAreaLevel2: String,
          country: String,
          postalCode: String,
        },
        viewport: {
          northeast: {
            lat: Number,
            lng: Number,
          },
          southwest: {
            lat: Number,
            lng: Number,
          },
        },
      },
      serviceRadius: {
        type: Number,
        default: 10,
        min: 1,
        max: 100,
      },
      businessType: {
        type: String,
        required: true,
        trim: true,
      },
      businessDescription: {
        type: String,
        required: true,
      },
      businessAddress: {
        type: String,
        required: true,
      },
      businessPhone: {
        type: String,
        required: true,
      },
      secondaryPhones: [String],
      businessEmail: {
        type: String,
        required: true,
      },
      businessWebsite: String,
      productCategories: [String],
      offers: String,
      whatsappNumbers: [String],
      landmark: {
        type: String,
        required: true,
        trim: true,
      },
      brandingServices: [
        {
          type: String,
          enum: [
            "Low MOQ",
            "OEM Services",
            "Private Labeling",
            "Ready to Ship",
          ],
        },
      ],
      titleImage: {
        url: String,
        publicId: String,
        width: Number,
        height: Number,
        format: String,
        bytes: Number,
      },
      socialMedia: {
        facebook: String,
        instagram: String,
        twitter: String,
        linkedin: String,
      },
      certificates: {
        certificateImages: [
          {
            url: String,
            publicId: String,
            name: String,
            uploadedAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    },

    documents: [
      {
        name: String,
        url: String,
        publicId: String,
        type: {
          type: String,
          enum: ["license", "tax_document", "identity", "other"],
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reviewedAt: Date,

    reason: {
      type: String,
      trim: true,
    },

    adminNotes: {
      type: String,
      trim: true,
    },

    resubmissionAllowed: {
      type: Boolean,
      default: true,
    },

    submissionCount: {
      type: Number,
      default: 1,
    },

    // Suspension tracking
    suspendedAt: {
      type: Date,
    },
    suspendedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    suspensionReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

sellerApplicationSchema.index({
  "applicationData.location.coordinates": "2dsphere",
});
sellerApplicationSchema.index({ user: 1 });
sellerApplicationSchema.index({ status: 1 });
sellerApplicationSchema.index({ createdAt: -1 });

export default mongoose.models.SellerApplication ||
  mongoose.model("SellerApplication", sellerApplicationSchema);
