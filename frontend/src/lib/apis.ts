import { requestHandler } from "./requestHandler";
import type { ChatMessage, ChatMessageWithTimestamp, ParsedDataType } from "./types";

export const getDataFromParsedText = async (parsedText: string) => {
  const response: { userDetails: ParsedDataType } = await requestHandler({
    method: "POST",
    endpoint: "/api/get-data-from-text",
    data: {
      parsedText,
    },
  });
  return response;
};

export const getNextQuestion = async (
  missingFields: (keyof ParsedDataType)[],
  chatHistory: ChatMessage[],
  userDetails: ParsedDataType
) => {
  const response: {
    currUserDetails: ParsedDataType;
    chat: ChatMessage;
    isCompleted: boolean;
  } = await requestHandler({
    method: "POST",
    endpoint: "/api/get-next-question",
    data: {
      missingFields,
      chatHistory,
      currUserDetails: userDetails,
    },
  });
  console.log("res", response);
  return response;
};

export const getInterviewResult = async (chatHistory: ChatMessageWithTimestamp[]) => {
  const response: any = await requestHandler({
    method: "POST",
    endpoint: "/api/interview-evaluation",
    data: {
      chatHistory,
    },
  });

  console.log("response from interview result", response);
  return response;
};
