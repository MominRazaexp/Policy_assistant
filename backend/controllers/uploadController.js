import path from "path";
import Document from "../models/Document.js";

export const uploadPDF = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ status: "error", message: "userId is required" });
  }
  if (!req.file) {
    return res.status(400).json({ status: "error", message: "PDF file is required" });
  }

  const file = req.file;
  const doc = await Document.create({
    userId,
    originalName: file.originalname,
    fileName: file.filename,
    path: path.resolve(file.path),
    status: "uploaded"
  });

  res.json({ status: "ok", docId: doc._id, document: doc });
};