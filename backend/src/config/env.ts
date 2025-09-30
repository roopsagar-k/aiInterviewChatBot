import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 3000,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};
