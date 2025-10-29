import GeneratedDraft from "../models/GeneratedDraft.js";
import { generateDraft } from "../langchain/generationChain.js";

export const generateContent = async (req, res) => {
  const { userId, type, details, docId } = req.body;
  if (!userId || !type) {
    return res.status(400).json({ status: "error", message: "userId and type are required" });
  }

  const draft = await generateDraft({ userId, type, details, docId });

  res.json({ status: "ok", draft });
};

export const getDraft = async (req, res) => {
  const { id } = req.params;
  const draft = await GeneratedDraft.findById(id);
  if (!draft) return res.status(404).json({ status: "error", message: "Draft not found" });
  res.json({ status: "ok", draft });
};