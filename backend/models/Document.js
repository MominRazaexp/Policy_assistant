import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    originalName: { type: String, required: true },
    fileName: { type: String, required: true },
    path: { type: String, required: true },
    pages: { type: Number, default: 0 },
    status: { type: String, enum: ["uploaded", "ingested"], default: "uploaded" },
    metadata: { type: Object, default: {} }
  },
  { timestamps: true }
);

export default mongoose.model("Document", DocumentSchema);