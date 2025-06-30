"use client"

import { useRef, useState } from "react"
import { Upload } from "lucide-react"
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

export default function UploadArea() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setExtractedText(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError("File size exceeds 50MB.");
      return;
    }

    setProcessing(true);

    try {
      const res = await fetch("/api/llmwhisper", {
        method: "POST",
        body: file,
      });

      if (!res.ok) {
        setError("Failed to process PDF.");
        setProcessing(false);
        return;
      }

      const data = await res.json();
      console.log("POST response:", data);
      if (!data.whisper_hash) {
        setError("No job hash returned from server.");
        setProcessing(false);
        return;
      }

      const text = await pollWhisperResult(data.whisper_hash);
      setExtractedText(text);

      const cohereRes = await fetch("/api/cohere", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!cohereRes.ok) {
        const errorData = await cohereRes.json();
        setError(`Failed to generate flashcards: ${errorData.error}`);
        return;
      }

      const cohereData = await cohereRes.json();
      console.log(cohereData.flashcards.content[0].text)

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred.";
      setError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs defaultValue="upload-pdf">
        <TabsList>
          <TabsTrigger value="upload-pdf">Upload PDF</TabsTrigger>
          <TabsTrigger value="paste-text">Paste text</TabsTrigger>
        </TabsList>
        <TabsContent value="upload-pdf">
          <Card className="border-2 border-dashed border-gray-300 hover:border-orange-400 transition-colors">
            <CardContent className="p-12">
              <div className="text-center transition-transform">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Drop your PDF here</h3>
                <p className="text-gray-600 mb-6">or click to browse your files</p>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700"
                  onClick={handleButtonClick}
                  disabled={processing}
                >
                  <Upload className="w-5 h-5 mr-2" />
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
                <p className="text-sm text-gray-500 mt-4">Supports PDF files up to 50MB</p>
                {error && <div className="text-red-500 mt-4">{error}</div>}
                {extractedText && (
                  <div className="mt-6 text-left bg-gray-100 p-4 rounded max-h-96 overflow-auto">
                    <h4 className="font-bold mb-2">Extracted Text:</h4>
                    <pre className="whitespace-pre-wrap">{extractedText}</pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="paste-text">
          <Textarea className="bg-white h-50 p-5" placeholder="Put your notes here. We'll do the rest."/>
        </TabsContent>
      </Tabs>
    </div>
  );
}