import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import IntervieweeTab from "@/components/interviewee-tab";
import { Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetUser } from "@/slices/userSlice";
import { completeInterview } from "@/slices/chatSlice";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getInterviewResult } from "@/lib/apis";

export default function IndexPage() {
  const dispatch = useAppDispatch();
  const userDetails = useAppSelector((state) => state.user.userDetails);
  const { messages } = useAppSelector((state) => state.chat);

  const handleNewInterview = async () => {
    const result = await getInterviewResult(messages);
    if (Object.keys(userDetails).length > 0) {
      // Save current chat + user details
      dispatch(completeInterview({ userDetails, result }));
    }
    // Reset user for new interview
    dispatch(resetUser());
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <section className="mx-auto w-full max-w-4xl flex flex-col gap-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-pretty text-2xl font-semibold tracking-tight">
              Interview Assistant
            </h1>
            <p className="text-muted-foreground">
              Switch between the candidate chat flow and reviewer dashboard.
            </p>
          </div>
          <Button onClick={handleNewInterview}>
           <span><Plus className="w-4 h-4" /></span> New Interview
          </Button>
        </header>

        <Tabs defaultValue="interviewee">
          <TabsList
            className={cn(
              "inline-flex items-center gap-1",
              "rounded-xl bg-muted p-1 shadow-sm",
              "max-w-max"
            )}
          >
            <TabsTrigger value="interviewee">Interviewee</TabsTrigger>
            <TabsTrigger value="interviewer">Interviewer</TabsTrigger>
          </TabsList>

          <TabsContent value="interviewee" className="mt-6">
            <IntervieweeTab />
          </TabsContent>
          <TabsContent value="interviewer" className="mt-6">
            <Navigate to={"/interviewer"} />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
