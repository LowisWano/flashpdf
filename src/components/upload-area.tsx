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
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Label } from "@/components/ui/label"

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
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pasteText, setPasteText] = useState("");

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
      const supabase = await createClient()
      const userData = await supabase.auth.getUser()

      const cohereRes = await fetch("/api/cohere", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          userId: userData?.data?.user?.id
        }),
      });

      if (!cohereRes.ok) {
        const errorData = await cohereRes.json();
        setError(`Failed to generate flashcards: ${errorData.error}`);
        return;
      }
      const response = await cohereRes.json();
      console.log(response.deck)
      router.push(`/dashboard/decks/${response.deck.id}/edit`)

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred.";
      setError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const handleTextSubmit = () => {
    // Implement text submission logic
  };

  return (
    <div className="flex w-full flex-col gap-4 md:gap-6">
      <Tabs defaultValue="upload-pdf">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload-pdf" className="text-sm">Upload PDF</TabsTrigger>
          <TabsTrigger value="paste-text" className="text-sm">Paste text</TabsTrigger>
        </TabsList>
        <TabsContent value="upload-pdf">
          <Card className="border-2 border-dashed border-gray-300 hover:border-orange-400 transition-colors">
            <CardContent className="p-6 md:p-12">
              <div className="text-center transition-transform">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Upload className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">Drop your PDF here</h3>
                <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">or click to browse your files</p>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-sm md:text-base"
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
                <p className="text-xs md:text-sm text-gray-500 mt-4">Supports PDF files up to 50MB</p>
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
        </TabsContent>
        <TabsContent value="paste-text">
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
                    className="w-full min-h-[200px] md:min-h-[300px] p-3 md:p-4 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm md:text-base"
                  />
                </div>
                <Button
                  onClick={handleTextSubmit}
                  disabled={!pasteText.trim() || processing}
                  className="w-full bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-sm md:text-base"
                >
                  {processing ? "Processing..." : "Generate Flashcards"}
                </Button>
                {error && <div className="text-red-500 text-sm">{error}</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}