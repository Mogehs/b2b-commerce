import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: 100,
    },
    brandName: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true,
    },
    model: {
      type: String,
      required: [true, "Model is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    placeOfOrigin: {
      type: String,
      required: [true, "Place of origin is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 0,
    },
    minOrderQuantity: {
      type: Number,
      required: [true, "Minimum order quantity is required"],
      min: 1,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: 1000,
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
      },
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
