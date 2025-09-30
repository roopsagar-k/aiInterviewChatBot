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