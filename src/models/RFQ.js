import mongoose from "mongoose";

const rfqSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Quoted", "Closed"],
    default: "Pending",
  },
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.RFQ || mongoose.model("RFQ", rfqSchema);
