import Document from "../models/Document.js";
import ChatSession from "../models/ChatSession.js";
import GeneratedDraft from "../models/GeneratedDraft.js";
import ActionLog from "../models/ActionLog.js";

export const getHistory = async (req, res) => {
  const { userId } = req.params;
  const [documents, chats, drafts, actions] = await Promise.all([
    Document.find({ userId }).sort({ createdAt: -1 }),
    ChatSession.findOne({ userId }),
    GeneratedDraft.find({ userId }).sort({ createdAt: -1 }),
    ActionLog.find({ userId }).sort({ createdAt: -1 })
  ]);

  res.json({
    status: "ok",
    data: { documents, chat: chats, drafts, actions }
  });
};