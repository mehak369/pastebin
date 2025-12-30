import mongoose from "mongoose";

const pasteSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null },
  maxViews: { type: Number, default: null },
  viewsUsed: { type: Number, default: 0 }
});

export default mongoose.model("Paste", pasteSchema);
