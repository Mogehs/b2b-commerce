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
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    applicationData: {
      businessName: {
        type: String,
        required: true,
        trim: true,
      },
      location: {
        type: String,
        required: true,
        trim: true,
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
      titleImage: {
        url: String,
        publicId: String,
      },
      socialMedia: {
        facebook: String,
        instagram: String,
        twitter: String,
        linkedin: String,
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
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
sellerApplicationSchema.index({ user: 1 });
sellerApplicationSchema.index({ status: 1 });
sellerApplicationSchema.index({ createdAt: -1 });

export default mongoose.models.SellerApplication ||
  mongoose.model("SellerApplication", sellerApplicationSchema);
