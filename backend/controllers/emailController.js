import { sendEmail } from "../services/emailService.js";
import GeneratedDraft from "../models/GeneratedDraft.js";

export const sendViaEmail = async (req, res) => {
  const { userId, to, subject, text, draftId } = req.body;
  if (!userId || !to || !subject || !text) {
    return res.status(400).json({ status: "error", message: "userId, to, subject, text are required" });
  }

  const { info, log } = await sendEmail({ userId, to, subject, text, draftId });

  if (draftId) {
    await GeneratedDraft.findByIdAndUpdate(draftId, { status: "sent_email" });
  }

  res.json({ status: "ok", email: info, log });
};