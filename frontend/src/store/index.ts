import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import userReducer from "../slices/userSlice";
import chatReducer from "../slices/chatSlice";
import timerReducer from "../slices/timerSlice";

const rootReducer = combineReducers({
  user: userReducer,
  chat: chatReducer,
  timer: timerReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
