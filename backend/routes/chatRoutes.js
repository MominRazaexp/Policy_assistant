import { Router } from "express";
import { chatAsk } from "../controllers/chatController.js";

const router = Router();

router.post("/", chatAsk);

export default router;