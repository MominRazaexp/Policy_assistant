import Document from "../models/Document.js";
import { loadPDF } from "../langchain/pdfLoader.js";
import { chunkPagesToDocs } from "../utils/chunking.js";
import { storeChunksWithEmbeddings } from "../langchain/vectorStore.js";

export const ingestPDF = async (req, res) => {
  const { userId, docId } = req.body;
  if (!userId || !docId) {
    return res.status(400).json({ status: "error", message: "userId and docId are required" });
  }

  const doc = await Document.findOne({ _id: docId, userId });
  if (!doc) {
    return res.status(404).json({ status: "error", message: "Document not found" });
  }

  const pages = await loadPDF(doc.path);
  const chunks = await chunkPagesToDocs(
    pages.map((p) => ({ pageContent: p.pageContent, metadata: { pageNumber: p.metadata.pageNumber } }))
  );

  const stored = await storeChunksWithEmbeddings({
    userId,
    docId: doc._id,
    chunks
  });

  doc.pages = pages.length;
  doc.status = "ingested";
  await doc.save();

  res.json({
    status: "ok",
    ingestedChunks: stored,
    pages: pages.length,
    docId: doc._id
  });
};