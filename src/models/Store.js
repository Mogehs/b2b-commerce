import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    location: { type: String, required: true },
    business: [{ type: String }],
    products: [{ type: String }],
    offers: [{ type: String }],
    bannerImage: { type: String, required: true },
    website: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    phone2: { type: String, required: true },
    phone3: { type: String, required: true },
    whatsapp: { type: String, required: true },
    whatsapp2: { type: String, required: true },
    landmark: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String, required: true },
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Store || mongoose.model("Store", storeSchema);
