import { Router } from "express";
import { sendViaEmail } from "../controllers/emailController.js";

const router = Router();

router.post("/send", sendViaEmail);

export default router;