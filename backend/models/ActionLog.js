import mongoose from "mongoose";

const ActionLogSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    draftId: { type: mongoose.Schema.Types.ObjectId, ref: "GeneratedDraft" },
    actionType: { type: String, enum: ["slack", "email"], required: true },
    target: { type: String, required: true }, // channel ID or email
    payload: { type: Object, default: {} }, // text, subject, etc
    responseMeta: { type: Object, default: {} }
  },
  { timestamps: true }
);

export default mongoose.model("ActionLog", ActionLogSchema);