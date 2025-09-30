import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import type {
  ChatMessage,
  ChatMessageWithTimestamp,
  InterviewResult,
  ParsedDataType,
} from "@/lib/types";

interface CompletedChat {
  userDetails: ParsedDataType;
  messages: ChatMessageWithTimestamp[];
  interviewResult: InterviewResult;
}

interface ChatState {
  messages: ChatMessageWithTimestamp[]; 
  completedChats: CompletedChat[]; 
}

const initialState: ChatState = {
  messages: [],
  completedChats: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      const messageWithTimestamp: ChatMessageWithTimestamp = {
        ...action.payload,
        timestamp: Date.now(),
      };
      state.messages.push(messageWithTimestamp);
    },
    // Call this when an interview is completed
    completeInterview: (state, action: PayloadAction<{ userDetails: ParsedDataType, result: InterviewResult }>) => {
      state.completedChats.push({
        userDetails: action.payload.userDetails, 
        messages: [...state.messages], 
        interviewResult: action.payload.result
      });
      state.messages = []; 
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    clearAllChats: (state) => {
      state.messages = [];
      state.completedChats = [];
    },
  },
});

const persistConfig = {
  key: "chat",
  storage,
  whitelist: ["messages", "completedChats"], 
};

export const { addMessage, clearMessages, completeInterview, clearAllChats } =
  chatSlice.actions;

export default persistReducer(persistConfig, chatSlice.reducer);
