import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";

import uploadRoutes from "./routes/uploadRoutes.js";
import ingestRoutes from "./routes/ingestRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import generateRoutes from "./routes/generateRoutes.js";
import slackRoutes from "./routes/slackRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// Static serve uploaded files if needed
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/ingest", ingestRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/generate", generateRoutes);
app.use("/api/slack", slackRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/history", historyRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});