import { Router } from "express";
import { getHistory } from "../controllers/historyController.js";

const router = Router();

router.get("/:userId", getHistory);

export default router;