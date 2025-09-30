import IntervieweeTab from "@/components/interviewee-tab";
import InterviewerTab from "@/components/interviewer-tab";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";

export default function InterviewerPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathToTab = (path: string) => {
    if (path.includes("/interviewer")) return "interviewer";
    return "interviewee";
  };

  const activeTab = pathToTab(location.pathname);

  const handleTabChange = (value: string) => {
    if (value === "interviewer") navigate("/interviewer");
    else navigate("/");
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <section className="mx-auto w-full max-w-4xl">
        <header className="mb-6">
          <h1 className="text-pretty text-2xl font-semibold tracking-tight">
            Interview Assistant
          </h1>
          <p className="text-muted-foreground">
            Switch between the candidate chat flow and reviewer dashboard.
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
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
            <InterviewerTab />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
