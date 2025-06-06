import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  image: String,
  provider: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
