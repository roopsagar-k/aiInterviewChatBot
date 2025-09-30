import { useState, useEffect } from "react";
import { FileInput } from "./file-input";
import { getDataFromParsedText } from "@/lib/apis";
import { getMissingFields } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setMissingFields, setUserDetails } from "@/slices/userSlice";
import { ChatUI } from "./chat-ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

export default function IntervieweeTab() {
  const [extracted, setExtracted] = useState<boolean>(false);
  const [showWelcome, setShowWelcome] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const userDetails = useAppSelector((state) => state.user.userDetails);
  const missingFields = useAppSelector((state) => state.user.missingFields);
  const interviewStarted = useAppSelector(
    (state) => state.user.interviewStarted
  );
  const interviewCompleted = useAppSelector((state) => state.user.interviewCompleted);
  const dispatch = useAppDispatch();


  const onParsedText = async (ocrText: string) => {
    setLoading(true);
    const res = await getDataFromParsedText(ocrText);
    dispatch(setUserDetails(res.userDetails));
    if (res.userDetails) {
      const missing = getMissingFields(res.userDetails);
      dispatch(setMissingFields(missing));
    }
    setExtracted(true);                                                                                                                                                                                                                                           
    setLoading(false);
  };

  const skipFileInput =
    interviewStarted || (userDetails && Object.keys(userDetails).length > 0);

  // Show welcome dialog if returning user and interview not started
  useEffect(() => {
      const isReturningUser = Boolean(
        userDetails && Object.keys(userDetails).length > 0
      );
    if (isReturningUser && interviewStarted && !interviewCompleted && !extracted) {
      setShowWelcome(true);
    }
  }, [interviewStarted, interviewCompleted]);

  return (
    <div>
      {!extracted && !skipFileInput && !loading && (
        <FileInput onDone={onParsedText} />
      )}

      {loading && (
        <div className="flex items-center justify-center h-[400px]">
          <Loader className="animate-spin text-primary w-12 h-12" />
        </div>
      )}

      {(extracted || skipFileInput) && userDetails && (
        <ChatUI missingFields={missingFields} userDetails={userDetails} />
      )}

      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome Back!</DialogTitle>
          </DialogHeader>
          <p className="mb-4">
            Continue your interview from where you left off.
          </p>
          <DialogFooter>
            <Button className="w-full" onClick={() => setShowWelcome(false)}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
