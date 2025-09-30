import { Router } from "express";
import {
  getDataFromText,
  getInterviewResult,
  getNextQuestion,
} from "../controllers/llm.controller";

const llmRouter = Router();

llmRouter
  .post("/get-data-from-text", getDataFromText)
  .post("/get-next-question", getNextQuestion)
  .post("/interview-evaluation", getInterviewResult);

export default llmRouter;
