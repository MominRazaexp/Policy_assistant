import { Router } from "express";
import { ingestPDF } from "../controllers/ingestController.js";

const router = Router();

router.post("/", ingestPDF);

export default router;