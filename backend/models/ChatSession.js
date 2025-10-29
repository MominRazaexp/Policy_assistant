import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    citations: { type: Array, default: [] }
  },
  { _id: false, timestamps: true }
);

const ChatSessionSchema = new mongoose.Schema(
  {
    userId: { type: String, index: true, required: true },
    userName: { type: String },
    messages: { type: [MessageSchema], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model("ChatSession", ChatSessionSchema);