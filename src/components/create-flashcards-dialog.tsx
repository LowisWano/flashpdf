"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Sparkles } from "lucide-react"

export function CreateFlashcardsDialog() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleNavigateToUpload = () => {
    setOpen(false)
    router.push("/dashboard/upload")
  }

  const handleNavigateToCreate = () => {
    setOpen(false)
    router.push("/dashboard/create")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-gradient-to-r from-[#2980B9] via-[#6DD5FA] to-[#FFFFFF] hover:from-[#2980B9] hover:to-[#6DD5FA] h-10 w-10 rounded-full"
        >
          <Plus/>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl p-11">
        <DialogHeader>
          <DialogTitle className="text-center">How do you want to create your flashcard set</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="flex flex-col sm:flex-row gap-5 w-full items-stretch">
            {/* Card 1: Generate from an upload */}
            <button
              type="button"
              onClick={handleNavigateToUpload}
              className="w-full flex-1 min-h-40 rounded-lg border border-gray-200 bg-white shadow hover:shadow-md transition p-6 flex flex-col items-center justify-center gap-2"
            >
              <Sparkles className="h-8 w-8 text-gray-500 mb-2" />
              <span className="font-semibold text-lg">Generate with AI</span>
              <span className="text-sm text-gray-500 text-center">
                Upload a PDF, image, or a scanned document and we&apos;ll generate flashcards for you.
              </span>
            </button>
            {/* Card 2: Create them yourself */}
            <button
              type="button"
              onClick={handleNavigateToCreate}
              className="w-full flex-1 min-h-40 rounded-lg border border-gray-200 bg-white shadow hover:shadow-md transition p-6 flex flex-col items-center justify-center gap-2"
            >
              <Plus className="h-8 w-8 text-gray-500 mb-2" />
              <span className="font-semibold text-lg">Create New Deck</span>
              <span className="text-sm text-gray-500 text-center">
                Manually add your own questions and answers.
              </span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
