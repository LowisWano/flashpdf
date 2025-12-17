"use client"

import { useRef, useState } from "react"
import { Upload, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

async function pollWhisperResult(whisperHash: string, { interval = 3000, maxAttempts = 20 } = {}) {
  let attempts = 0;
  while (attempts < maxAttempts) {
    const statusRes = await fetch(`/api/llmwhisper?whisper_hash=${encodeURIComponent(whisperHash)}&type=status`);
    if (statusRes.status === 400) {
      const errorData = await statusRes.json();
      if (
        errorData.message &&
        errorData.message.includes("Whisper job not found for the provided whisper hash")
      ) {
        await new Promise(r => setTimeout(r, interval));
        attempts++;
        continue;
      } else {
        throw new Error(errorData.message || "Unknown error from status endpoint.");
      }
    }

    const statusData = await statusRes.json();

    if (statusData.status === "processed") {
      const textRes = await fetch(`/api/llmwhisper?whisper_hash=${encodeURIComponent(whisperHash)}`);
      const textData = await textRes.json();
      if (textData.result_text) {
        return textData.result_text;
      } else {
        throw new Error("Text extraction failed or not available.");
      }
    }

    if (statusData.status === "failed") {
      throw new Error("Processing failed.");
    }

    await new Promise(r => setTimeout(r, interval));
    attempts++;
  }
  throw new Error("Timed out waiting for LLMWhisper result.");
}

export default function UploadArea({ folderId }: { folderId?: string }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [processing, setProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pasteText, setPasteText] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [loadingState, setLoadingState] = useState<'uploading' | 'processing' | 'generating' | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const processFile = async (file: File) => {
  setError(null);
  setExtractedText(null);
  setFileName(file.name);
  
  if (file.size > 50 * 1024 * 1024) {
    setError("File size exceeds 50MB.");
    return;
  }

  setProcessing(true);
  setLoadingState('uploading');

  try {
    const res = await fetch("/api/llmwhisper", {
      method: "POST",
      body: file,
    });

    if (!res.ok) {
      setError("Failed to process PDF.");
      setProcessing(false);
      setLoadingState(null);
      return;
    }

    const data = await res.json();
    console.log("POST response:", data);
    if (!data.whisper_hash) {
      setError("No job hash returned from server.");
      setProcessing(false);
      setLoadingState(null);
      return;
    }

    setLoadingState('processing');
    const text = await pollWhisperResult(data.whisper_hash);
    setExtractedText(text);
    const supabase = await createClient()
    const userData = await supabase.auth.getUser()

    setLoadingState('generating');
    const cohereRes = await fetch("/api/cohere", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        userId: userData?.data?.user?.id,
        folderId: folderId
      }),
    });

    if (!cohereRes.ok) {
      const errorData = await cohereRes.json();
      setError(`Failed to generate flashcards: ${errorData.error}`);
      return;
    }
    const response = await cohereRes.json();
    console.log(response.deck)
    // If we have a folderId, redirect back to the folder, otherwise go to the deck edit page
    if (folderId) {
      router.push(`/dashboard/folders/${folderId}`);
    } else {
      router.push(`/dashboard/decks/${response.deck.id}/edit`);
    }

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred.";
    setError(errorMessage);
  } finally {
    setProcessing(false);
  }
};

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  // Drag and Drop Event Handlers
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set drag over to false if we're leaving the drop zone entirely
    if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      await processFile(file);
    }
  };

  if(loadingState){
    return(
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-cyan-50 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-cyan-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{fileName || 'Your Content'}</h3>
              <p className="text-sm text-gray-600">PDF Document</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                {loadingState === 'uploading' && 'Uploading...'}
                {loadingState === 'processing' && 'Processing text...'}
                {loadingState === 'generating' && 'Generating flashcards...'}
              </span>
              <span>{loadingState === 'generating' ? '75%' : loadingState === 'processing' ? '50%' : '25%'}</span>
            </div>
            <Progress 
              value={loadingState === 'generating' ? 75 : loadingState === 'processing' ? 50 : 25} 
              className="h-2" 
            />
          </div>
        </CardContent>
      </Card>
    
    )
  }

  return (
    <div className="flex w-full flex-col gap-4 md:gap-6">
      {/* <Tabs defaultValue="upload-pdf">
        <TabsList className="w-full">
          <TabsTrigger value="upload-pdf" className="text-sm">Upload PDF</TabsTrigger> */}
          {/* <TabsTrigger value="paste-text" className="text-sm">Paste text</TabsTrigger> */}
        {/* </TabsList>
        <TabsContent value="upload-pdf"> */}
          <div
            ref={dropZoneRef}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`relative transition-all duration-200 ${
              isDragOver ? 'scale-105' : 'scale-100'
            }`}
          >
            <Card className={`border-2 border-dashed transition-all duration-200 ${
              isDragOver 
                ? 'border-cyan-500 bg-cyan-50 shadow-lg' 
                : 'border-gray-300 hover:border-cyan-400'
            }`}>
              <CardContent className="p-6 md:p-12">
                <div className="text-center transition-transform">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 transition-all duration-200 ${
                    isDragOver 
                      ? 'bg-gradient-to-br from-[#2980B9] via-[#6DD5FA] to-[#FFFFFF] scale-110' 
                        : 'bg-gradient-to-br from-[#2980B9] via-[#6DD5FA] to-[#FFFFFF]'
                  }`}>
                    <Upload className={`w-6 h-6 md:w-8 md:h-8 text-white transition-all duration-200 ${
                      isDragOver ? 'scale-110' : 'scale-100'
                    }`} />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2">
                    {isDragOver ? 'Drop your PDF here!' : 'Drop your PDF here'}
                  </h3>
                  <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
                    {isDragOver ? 'Release to upload' : 'or click to browse your files'}
                  </p>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#2980B9] via-[#6DD5FA] to-[#FFFFFF] hover:from-[#2980B9] hover:to-[#6DD5FA] text-sm md:text-base"
                    onClick={handleButtonClick}
                    disabled={processing}
                  >
                    <Upload className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    {processing ? "Processing..." : "Choose File"}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={processing}
                  />
                  <p className="text-xs md:text-sm text-gray-500 mt-4">Upload only 1 file at a time</p>
                  {error && <div className="text-red-500 mt-4 text-sm">{error}</div>}
                  {extractedText && (
                    <div className="mt-6 text-left bg-gray-100 p-4 rounded max-h-96 overflow-auto">
                      <h4 className="font-bold mb-2">Extracted Text:</h4>
                      <pre className="whitespace-pre-wrap">{extractedText}</pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            {isDragOver && (
              <div className="absolute inset-0 bg-cyan-500/10 rounded-lg border-2 border-dashed border-cyan-500 pointer-events-none" />
            )}
          </div>
        {/* </TabsContent> */}
        {/* <TabsContent value="paste-text">
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paste-text" className="text-sm md:text-base">Paste your text content</Label>
                  <textarea
                    id="paste-text"
                    value={pasteText}
                    onChange={(e) => setPasteText(e.target.value)}
                    placeholder="Paste your text content here..."
                    className="w-full min-h-[200px] md:min-h-[300px] p-3 md:p-4 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm md:text-base"
                  />
                </div>
                <Button
                  onClick={handleTextSubmit}
                  disabled={!pasteText.trim() || processing}
                  className="w-full bg-gradient-to-r from-[#2980B9] via-[#6DD5FA] to-[#FFFFFF] hover:from-[#2980B9] hover:to-[#6DD5FA] text-sm md:text-base"
                >
                  {processing ? "Processing..." : "Generate Flashcards"}
                </Button>
                {error && <div className="text-red-500 text-sm">{error}</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
      {/* </Tabs> */}
      
    </div>
  );
}