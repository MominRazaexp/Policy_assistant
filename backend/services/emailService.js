import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import ActionLog from "../models/ActionLog.js";
console.log("process.env.EMAIL_USER", process.env.EMAIL_USER);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendEmail({ userId, to, subject, text, draftId }) {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  });

  const log = await ActionLog.create({
    userId,
    draftId,
    actionType: "email",
    target: to,
    payload: { subject, text },
    responseMeta: {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected
    }
  });

  return { info, log };
}