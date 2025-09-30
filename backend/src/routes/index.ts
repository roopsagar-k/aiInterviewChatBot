import { Router } from "express";
import llmRouter from "./llm.route";

const router = Router();
router.use(llmRouter);

export default router;
