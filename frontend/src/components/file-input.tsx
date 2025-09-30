import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"; 
import { FileText, UploadCloud, X } from "lucide-react";
import pdfToImages from "@/lib/utils";
import { createWorker } from "tesseract.js";

const MAX_SIZE_MB = 10;

export const FileInput = ({
  onDone,
}: {
  onDone: (ocrText: string) => Promise<void>;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Tesseract.Worker | null>(null);
  const [progress, setProgress] = useState(0);
  const [parsing, setParsing] = useState(false);


  const initializeWorker = async () => {
    if (!workerRef.current) {
      workerRef.current = await createWorker({
        logger: (message) => {
          if ("progress" in message) {
            // progress is 0 → 1, convert to %
            setProgress(Math.round(message.progress * 100));
          }
        },
      });
      await workerRef.current.load();
      await workerRef.current.loadLanguage("eng");
      await workerRef.current.initialize("eng");
    }
  };

  const validate = (f: File) => {
    const isPdf =
      f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");
    const underLimit = f.size <= MAX_SIZE_MB * 1024 * 1024;
    if (!isPdf) return "Please select a PDF file.";
    if (!underLimit) return `File must be under ${MAX_SIZE_MB}MB.`;
    return null;
  };

  const extractText = async (f: File) => {
    setParsing(true);
    setProgress(0);
    await initializeWorker();

    const worker = workerRef.current;
    if (!worker) throw new Error("OCR worker not initialized");

    const pdfUrl = URL.createObjectURL(f);
    const imageUrls = await pdfToImages(pdfUrl);

    let ocrText = "";
    for (const imageUrl of imageUrls) {
      const res = await worker.recognize(imageUrl);
      ocrText += " " + res.data.text;
    }
    console.log("ocr text", ocrText);
    setParsing(false);
    setProgress(100);
    await onDone(ocrText.trim());
  };

  const onFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    const v = validate(f);
    if (v) {
      setError(v);
      setFile(null);
      return;
    }
    setError(null);
    setFile(f);
  }, []);

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    onFiles(e.dataTransfer?.files ?? null);
  };

  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    setProgress(0);
    setParsing(false);
    const input = document.getElementById(
      "pdf-input"
    ) as HTMLInputElement | null;
    if (input) input.value = "";
  };

  const triggerBrowse = () => {
    const input = document.getElementById(
      "pdf-input"
    ) as HTMLInputElement | null;
    input?.click();
  };

  return (
    <div className="w-full">
      <Card className="w-full shadow-sm border">
        <CardHeader className="text-left pb-4">
          <CardTitle className="text-xl font-semibold">
            Upload Resume PDF
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Drag and drop a PDF, or click below to browse. Only PDF files are
            accepted.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-6 space-y-6">
          <input
            id="pdf-input"
            type="file"
            accept="application/pdf"
            onChange={(e) => onFiles(e.target.files)}
            className="sr-only"
          />

          {/* Upload area */}
          <label
            htmlFor="pdf-input"
            role="button"
            aria-label="Upload PDF"
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            className={`
              group relative w-full rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer
              min-h-[200px] flex items-center justify-center
              ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/30 bg-muted/20 hover:bg-muted/40"
              }
              focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
            `}
          >
            <div className="text-center px-6 py-8">
              {file ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <FileText className="w-8 h-8 text-primary" />
                  </div> 
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground max-w-xs truncate px-4">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        triggerBrowse();
                      }}
                      className="text-xs"
                    >
                      Replace
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        clearFile();
                      }}
                      className="text-xs text-destructive hover:bg-destructive/10"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <div
                    className={`p-3 rounded-full transition-colors ${
                      dragActive ? "bg-primary/10" : "bg-muted"
                    }`}
                  >
                    <UploadCloud
                      className={`w-8 h-8 ${
                        dragActive ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      Drop your PDF here
                    </p>
                    <p className="text-xs text-muted-foreground">
                      or click to browse • Max {MAX_SIZE_MB}MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </label>

          {/* Error */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive text-center">{error}</p>
            </div>
          )}

          {/* Submit button */}
          {file && (
            <div className="flex flex-col items-center space-y-4">
              <Button
                onClick={() => extractText(file)}
                disabled={parsing}
                className="px-6"
              >
                {parsing ? "Parsing..." : "Submit"}
              </Button>

              {parsing && (
                <div className="w-full">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    {progress}% completed
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Browse button when no file */}
          {!file && (
            <div className="text-center">
              <Button
                onClick={triggerBrowse}
                variant="default"
                size="sm"
                className="px-6"
              >
                Choose PDF
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
