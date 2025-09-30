import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { tick } from "@/slices/timerSlice";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function Timer() {
  const dispatch = useAppDispatch();
  const { timeLeft, isRunning, currentDuration } = useAppSelector(
    (state) => state.timer
  );

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      dispatch(tick());
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, dispatch]);

  if (!isRunning || !currentDuration) return null;

  const percentage = (timeLeft / currentDuration) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center justify-between bg-muted px-4 py-2 rounded-lg mb-2">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span>
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>
      <div className="flex-1 mx-4 h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
        <div
          className={cn("h-2 bg-primary transition-all")}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {/* <button
        className="text-xs text-destructive ml-2 hover:underline"
        onClick={() => dispatch(stopTimer())}
      >
        Stop
      </button> */}
    </div>
  );
}
