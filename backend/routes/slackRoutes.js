import { Router } from "express";
import { sendToSlack } from "../controllers/slackController.js";

const router = Router();

router.post("/send", sendToSlack);

export default router;