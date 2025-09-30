import { asyncHandler } from "../utils/async-handler";
import { Llm } from "../services/llm";
import { ENV } from "../config/env";
import ApiResponse from "../utils/api-response";
const llm = new Llm(ENV.GEMINI_API_KEY);

export const getDataFromText = asyncHandler(async (req, res) => {
  const { parsedText } = req.body;
  const userDetails = await llm.getDataFromText(parsedText);
  console.log("extracted data from llm", userDetails);
  res.json(
    new ApiResponse(
      200,
      { userDetails },
      "Extracted user details from the resume successfully!"
    )
  );
});

export const getNextQuestion = asyncHandler(async (req, res) => {
  const { missingFields, chatHistory, currUserDetails } = req.body;
  const response = await llm.getNextQuestion(
    missingFields,
    chatHistory,
    currUserDetails
  );
  console.log(`Nextquestion: ${JSON.stringify(response)}`);
  res.json(
    new ApiResponse(200, response, "Next question fetched sucessfully!")
  );
});

export const getInterviewResult = asyncHandler(async (req, res) => {
  const { chatHistory } = req.body;
  const response = await llm.evaluate(chatHistory);
  res.json(
    new ApiResponse(200, response, "Interview results generated successfully!")
  );
});
