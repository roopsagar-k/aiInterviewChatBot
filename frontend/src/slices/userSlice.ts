import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ParsedDataType } from "@/lib/types";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { getMissingFields } from "@/lib/utils";

export interface UserState {
  userDetails: ParsedDataType;
  missingFields: (keyof ParsedDataType)[];
  hasCompleteDetails: boolean;
  interviewStarted: boolean;
  interviewCompleted: boolean;
}

const initialState: UserState = {
  userDetails: {},
  missingFields: [],
  hasCompleteDetails: false,
  interviewStarted: false,
  interviewCompleted: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action: PayloadAction<ParsedDataType>) => {
      state.userDetails = action.payload;
      const missing = getMissingFields(action.payload);
      state.missingFields = missing;
      state.hasCompleteDetails = missing.length === 0;
    },
    setMissingFields: (
      state,
      action: PayloadAction<(keyof ParsedDataType)[]>
    ) => {
      state.missingFields = action.payload;
      state.hasCompleteDetails = action.payload.length === 0;
    },
    updateField: (
      state,
      action: PayloadAction<{ key: keyof ParsedDataType; value: string }>
    ) => {
      state.userDetails[action.payload.key] = action.payload.value;
      state.missingFields = getMissingFields(state.userDetails);
      state.hasCompleteDetails = state.missingFields.length === 0;
    },
    updateAllFields: (
      state,
      action: PayloadAction<Partial<ParsedDataType>>
    ) => {
      state.userDetails = {
        ...state.userDetails,
        ...action.payload,
      };
      state.missingFields = getMissingFields(state.userDetails);
      state.hasCompleteDetails = state.missingFields.length === 0;
    },
    startInterview: (state) => {
      state.interviewStarted = true;
    },
    endInterview: (state) => {
      state.interviewCompleted = true;
    },
    resetUser: () => initialState,
  },
});

export const {
  setUserDetails,
  setMissingFields,
  updateField,
  updateAllFields,
  startInterview,
  endInterview,
  resetUser,
} = userSlice.actions;

const persistConfig = {
  key: "user",
  storage,
  whitelist: [
    "userDetails",
    "missingFields",
    "hasCompleteDetails",
    "interviewStarted",
    "interviewCompleted",
  ],
};

export default persistReducer(persistConfig, userSlice.reducer);
