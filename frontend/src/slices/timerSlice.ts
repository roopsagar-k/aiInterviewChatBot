import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  currentDuration: number | null; // total duration of current question
}

const initialState: TimerState = {
  timeLeft: 0,
  isRunning: false,
  currentDuration: null,
};

const difficultyDurations: Record<"easy" | "medium" | "hard", number> = {
  easy: 2, //20
  medium: 2, //60
  hard: 2, //120
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    startTimer: (state, action: PayloadAction<"easy" | "medium" | "hard">) => {
      const duration = difficultyDurations[action.payload];
      state.timeLeft = duration;
      state.currentDuration = duration;
      state.isRunning = true;
    },
    tick: (state) => {
      if (state.isRunning && state.timeLeft > 0) {
        state.timeLeft -= 1;
      }
      if (state.timeLeft === 0) {
        state.isRunning = false; // auto-stop when finished
      }
    },
    stopTimer: (state) => {
      state.isRunning = false;
    },
    resetTimer: (state) => {
      state.timeLeft = 0;
      state.currentDuration = null;
      state.isRunning = false;
    },
  },
});

export const { startTimer, tick, stopTimer, resetTimer } = timerSlice.actions;

export default timerSlice.reducer;
