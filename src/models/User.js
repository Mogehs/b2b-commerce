import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
    },

    image: {
      type: String,
    },

    provider: {
      type: String,
      default: "credentials",
    },

    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
    },

    sellerApplication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SellerApplication",
    },

    profile: {
      phone: String,
      company: String,
      whatsapp: String,
      address: String,
      country: String,
      website: String,
      description: String,
    },

    favProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    favSellers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    reviews: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    rfqs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RFQ",
      },
    ],

    purchaseHistory: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        price: Number,
        purchasedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
