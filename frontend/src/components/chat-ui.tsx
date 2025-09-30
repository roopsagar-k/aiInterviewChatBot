import React, { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send } from "lucide-react";
import type { ChatMessage, ParsedDataType } from "@/lib/types";
import { addMessage, completeInterview } from "@/slices/chatSlice";
import { getInterviewResult, getNextQuestion } from "@/lib/apis";
import {
  endInterview,
  resetUser,
  startInterview,
  updateAllFields,
} from "@/slices/userSlice";
import { startTimer, resetTimer } from "@/slices/timerSlice";
import { useNavigate } from "react-router-dom";
import { Timer } from "./Timer";

interface ChatUIProps {
  missingFields: (keyof ParsedDataType)[];
  userDetails: ParsedDataType;
}

export const ChatUI: React.FC<ChatUIProps> = ({
  missingFields,
  userDetails,
}) => {
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => state.chat.messages);
  const hasCompleted = useAppSelector((state) => state.user.hasCompleteDetails);
  const { isRunning, timeLeft } = useAppSelector((state) => state.timer);
  const firstRender = useRef(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const interviewStarted = useAppSelector(
    (state) => state.user.interviewStarted
  );
  const interviewComplete = useAppSelector(
    (state) => state.user.interviewCompleted
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef(input);
  const hasAnsweredRef = useRef(false);

  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (!isRunning && timeLeft === 0 && !hasAnsweredRef.current) {
      const textToSend =
        inputRef.current.trim() || "DIDNT_ANSWERED_IN_SPECIFIED_TIME";
      handleSendAuto(textToSend);
    }
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (interviewComplete) {
      setSubmitting(true);
      handleNewInterview().finally(() => {
        setSubmitting(false);
      });
    }
  }, [interviewComplete]);

  const handleNewInterview = async () => {
    const result = await getInterviewResult(messages);
    if (Object.keys(userDetails).length > 0) {
      // Save current chat + user details
      dispatch(completeInterview({ userDetails, result }));
    }
    dispatch(resetUser());
    navigate("/interviewer");
  };

  // Function to get AI question
  const fetchNextQuestion = async (additionalMessages: ChatMessage[] = []) => {
    if (hasCompleted) dispatch(startInterview());
    setLoading(true);

    try {
      const {
        currUserDetails,
        chat: nextQuestion,
        isCompleted,
      } = await getNextQuestion(
        missingFields,
        [...messages, ...additionalMessages],
        userDetails
      );

      dispatch(addMessage(nextQuestion));

      // Reset the answered flag for the new question
      hasAnsweredRef.current = false;

      // Only start timer if it's an interview question
      if (nextQuestion.type) {
        dispatch(startTimer(nextQuestion.type));
      } else {
        dispatch(resetTimer());
      }

      if (isCompleted) {
        dispatch(endInterview());
        dispatch(resetTimer());
      }

      if (missingFields.length !== 0) {
        dispatch(updateAllFields(currUserDetails));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendAuto = async (text: string) => {
    if (!text) return;

    const userMessage: ChatMessage = {
      role: "user",
      text,
    };

    dispatch(addMessage(userMessage));
    setInput("");

    await fetchNextQuestion([userMessage]);
  };

  useEffect(() => {
    if (messages.length === 0 && Object.keys(userDetails).length > 0) {
      fetchNextQuestion();
    }
  }, [messages, userDetails]);

  const handleSend = async () => {
    if (!input.trim()) return;

    hasAnsweredRef.current = true;

    const userMessage: ChatMessage = {
      role: "user",
      text: input,
    };

    dispatch(addMessage(userMessage));
    setInput("");
    await fetchNextQuestion([userMessage]);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card className="w-full max-w-4xl mx-auto mt-4 flex flex-col h-[600px]">
      <CardHeader>
        <CardTitle>AI Chat Assistant</CardTitle>
      </CardHeader>

      {/* Timer UI */}
      <Timer />

      <CardContent
        ref={contentRef}
        className="flex-1 overflow-y-auto flex flex-col gap-2 p-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-muted/20"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-md max-w-[80%] ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground self-end"
                : "bg-muted text-muted-foreground self-start"
            }`}
          >
            <p>{msg.text}</p>
            {"timestamp" in msg && (
              <span className="text-xs opacity-70 mt-1 block">
                {new Date((msg as any).timestamp).toLocaleTimeString()}
              </span>
            )}
          </div>
        ))}

        {/* Show typing indicator when loading */}
        {loading && (
          <div className="p-2 rounded-md max-w-[80%] bg-muted text-muted-foreground self-start">
            <span className="animate-pulse">AI is typing...</span>
          </div>
        )}
      </CardContent>

      {hasCompleted && !interviewStarted && !interviewComplete ? (
        <div className="p-4">
          <Button
            className="w-full h-14 text-lg"
            onClick={async () => {
              fetchNextQuestion();
            }}
            disabled={loading}
          >
            {loading ? "Starting..." : "Start Interview"}
          </Button>
        </div>
      ) : interviewComplete ? (
        <div className="p-4 text-center text-muted-foreground">
          {submitting ? (
            <p>Submitting your response...</p>
          ) : (
            <p>Thank you! Your interview has been submitted.</p>
          )}
        </div>
      ) : (
        <div className="border-t bg-background p-4 md:p-6">
          <div className="flex items-center gap-2 md:gap-3 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Input
                placeholder="Type your message..."
                disabled={loading}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="h-12 md:h-14 text-base md:text-lg px-4 md:px-6 pr-12 rounded-full border-2 focus:border-primary transition-all"
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              size="icon"
              className="h-12 w-12 md:h-14 md:w-14 rounded-full flex-shrink-0"
            >
              <Send className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
