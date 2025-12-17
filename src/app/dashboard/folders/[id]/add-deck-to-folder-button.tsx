"use client"

import { useRouter } from 'next/navigation'
import { Plus, FileText, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"

interface AddDeckToFolderButtonProps {
  folderId: string
}

export default function AddDeckToFolderButton({ folderId }: AddDeckToFolderButtonProps) {
  const router = useRouter()
  
  const handleAddExistingDeck = () => {
    router.push(`/dashboard/decks?selectFor=folder&folderId=${folderId}&excludeFolderId=${folderId}`)
  }
  
  const handleCreateNewDeck = () => {
    router.push(`/dashboard/create?folderId=${folderId}`)
  }
  
  const handleAIGenerate = () => {
    router.push(`/dashboard/upload?folderId=${folderId}`)
  }
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-gradient-to-r from-[#2980B9] via-[#6DD5FA] to-[#FFFFFF] hover:from-[#2980B9] hover:to-[#6DD5FA]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Decks
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl p-8">
        <DialogHeader>
          <DialogTitle className="text-center">Add Decks to Folder</DialogTitle>
          <DialogDescription className="text-center">
            Choose how you want to add decks to this folder
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 mt-4">
          <div className="flex flex-col sm:flex-row gap-5 w-full items-stretch">
            {/* Add Existing Decks */}
            <button
              type="button"
              onClick={handleAddExistingDeck}
              className="flex-1 min-h-40 rounded-lg border border-gray-200 bg-white shadow hover:shadow-md transition p-6 flex flex-col items-center justify-center gap-2"
            >
              <FileText className="h-8 w-8 text-gray-500 mb-2" />
              <span className="font-semibold text-lg">Add Existing Decks</span>
              <span className="text-sm text-gray-500 text-center">
                Select from your existing decks to add to this folder.
              </span>
            </button>
            
            {/* Create New Deck */}
            <button
              type="button"
              onClick={handleCreateNewDeck}
              className="flex-1 min-h-40 rounded-lg border border-gray-200 bg-white shadow hover:shadow-md transition p-6 flex flex-col items-center justify-center gap-2"
            >
              <Plus className="h-8 w-8 text-gray-500 mb-2" />
              <span className="font-semibold text-lg">Create New Deck</span>
              <span className="text-sm text-gray-500 text-center">
                Manually add your own questions and answers.
              </span>
            </button>
            
            {/* Generate with AI */}
            <button
              type="button"
              onClick={handleAIGenerate}
              className="flex-1 min-h-40 rounded-lg border border-gray-200 bg-white shadow hover:shadow-md transition p-6 flex flex-col items-center justify-center gap-2"
            >
              <Sparkles className="h-8 w-8 text-gray-500 mb-2" />
              <span className="font-semibold text-lg">Generate with AI</span>
              <span className="text-sm text-gray-500 text-center">
                Upload a PDF or document and we&apos;ll generate flashcards for you.
              </span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
