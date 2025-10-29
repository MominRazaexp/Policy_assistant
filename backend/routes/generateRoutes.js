import { Router } from "express";
import { generateContent, getDraft } from "../controllers/generateController.js";

const router = Router();

router.post("/", generateContent);
router.get("/:id", getDraft);

export default router;