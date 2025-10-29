import mongoose from "mongoose";

const PolicyChunkSchema = new mongoose.Schema(
  {
    userId: { type: String, index: true, required: true },
    docId: { type: mongoose.Schema.Types.ObjectId, ref: "Document", index: true, required: true },
    pageNumber: { type: Number, index: true },
    chunkIndex: { type: Number },
    text: { type: String, required: true },
    embedding: { type: [Number], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model("PolicyChunk", PolicyChunkSchema);