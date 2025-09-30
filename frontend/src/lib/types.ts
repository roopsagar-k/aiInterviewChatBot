export type ParsedDataType = {
    name?: string;
    email?: string;
    phone?: string;
}

export type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  type?: "easy" | "medium" | "hard";
};

export type ChatMessageWithTimestamp = ChatMessage & {
  timestamp: number;
};

export type InterviewResult = {
  pros: string[];
  cons: string[];
  summary: string;
  totalPoints: number;
};
