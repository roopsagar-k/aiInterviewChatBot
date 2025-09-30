import { useState, useMemo } from "react";
import { useAppSelector } from "@/store/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

interface FilteredChat {
  index: number;
  userName: string;
  email: string;
  phone: string;
  messages: { text: string; timestamp: number }[];
  interviewResult: {
    Points: number;
    Pros: string[];
    Cons: string[];
    Summary: string;
  };
}

const InterviewerTab = () => {
  const completedChats = useAppSelector((state) => state.chat.completedChats);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filteredChats: FilteredChat[] = useMemo(() => {
    return completedChats
      .map((chat, idx) => ({
        index: idx,
        userName: chat.userDetails.name || "Unnamed",
        email: chat.userDetails.email || "-",
        phone: chat.userDetails.phone || "-",
        messages: chat.messages.map((msg) => ({
          text: msg.text,
          timestamp: msg.timestamp,
        })),
        interviewResult: {
          Points: chat.interviewResult.totalPoints || 0,
          Pros: chat.interviewResult.pros || [],
          Cons: chat.interviewResult.cons || [],
          Summary: chat.interviewResult.summary || "",
        },
      }))
      .filter((chat) =>
        chat.userName.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.interviewResult.Points - a.interviewResult.Points);
  }, [completedChats, searchQuery]);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Search className="text-primary w-5 h-5" />
        <Input
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md"
        />
      </div>

      <div className="space-y-2">
        {filteredChats.length === 0 ? (
          <p className="text-secondary">No interviews found.</p>
        ) : (
          filteredChats.map((chat) => (
            <Card
              key={chat.index}
              className="border-primary/20 hover:shadow-lg transition-all"
            >
              <CardHeader
                className="flex justify-between items-center cursor-pointer"
                onClick={() =>
                  setExpandedIndex(
                    expandedIndex === chat.index ? null : chat.index
                  )
                }
              >
                <CardTitle className="text-primary font-semibold">
                  {chat.userName} - Points: {chat.interviewResult.Points}
                </CardTitle>
                {expandedIndex === chat.index ? (
                  <ChevronUp className="text-secondary w-5 h-5" />
                ) : (
                  <ChevronDown className="text-secondary w-5 h-5" />
                )}
              </CardHeader>

              {expandedIndex === chat.index && (
                <CardContent className="space-y-4">
                  {/* User Details */}
                  <div className="space-y-1">
                    <p className="text-foreground">
                      <span className="font-semibold">Name:</span>{" "}
                      {chat.userName}
                    </p>
                    <p className="text-foreground">
                      <span className="font-semibold">Email:</span> {chat.email}
                    </p>
                    <p className="text-foreground">
                      <span className="font-semibold">Phone:</span> {chat.phone}
                    </p>
                  </div>

                  {/* Scores & Feedback */}
                  <div>
                    <p className="font-semibold text-foreground">Pros:</p>
                    <ul className="list-disc list-inside">
                      {chat.interviewResult.Pros.map((pro, idx) => (
                        <li key={idx}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Cons:</p>
                    <ul className="list-disc list-inside">
                      {chat.interviewResult.Cons.map((con, idx) => (
                        <li key={idx}>{con}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Summary:</p>
                    <p>{chat.interviewResult.Summary}</p>
                  </div>

                  {/* Full Chat History */}
                  <div className="mt-4">
                    <p className="font-semibold text-foreground mb-2">
                      Chat History:
                    </p>
                    <div className="max-h-64 overflow-y-auto border border-muted-foreground/20 rounded p-2 space-y-2 bg-secondary/5">
                      {chat.messages.map((msg, idx) => (
                        <div key={idx} className="flex flex-col">
                          <span className="text-foreground">{msg.text}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(msg.timestamp).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default InterviewerTab;
