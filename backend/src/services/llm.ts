import { GoogleGenAI } from "@google/genai";
import type { ChatMessage, ParsedDataType } from "../types";
import {
  ExtractRequiredFieldsPrompt,
  GetChatQuestionPrompt,
  EvaluatePrompt,
} from "../prompt";

export class Llm {
  private apiKey: string;
  private ai;
  private model: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.ai = new GoogleGenAI({ apiKey: this.apiKey });
    this.model = "gemini-2.5-flash";
  }

  private extractJson(str: string) {
    const match = str.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  }

  async getDataFromText(text: string) {
    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: ExtractRequiredFieldsPrompt(text),
    });
    const parsed = this.extractJson(response.text!);
    return parsed as ParsedDataType;
  }

  async getNextQuestion(
    missingFields: (keyof ParsedDataType)[],
    chatHistory: ChatMessage[],
    currUserDetails: ParsedDataType
  ) {
    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: GetChatQuestionPrompt(
        missingFields,
        chatHistory,
        currUserDetails
      ),
    });
    const parsed = this.extractJson(response.text!);
    return parsed;
  }

  async evaluate(chatHistory: ChatMessage[]) {
    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: EvaluatePrompt(chatHistory),
    });
    const parsed = this.extractJson(response.text!);
    return parsed;
  }
}
