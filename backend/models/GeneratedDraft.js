import mongoose from "mongoose";

const GeneratedDraftSchema = new mongoose.Schema(
  {
    userId: { type: String, index: true, required: true },
    type: { type: String, required: true },
    content: { type: String, required: true },
    relatedDocIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
    status: { type: String, enum: ["draft", "sent_slack", "sent_email"], default: "draft" },
    meta: { type: Object, default: {} }
  },
  { timestamps: true }
);

export default mongoose.model("GeneratedDraft", GeneratedDraftSchema);