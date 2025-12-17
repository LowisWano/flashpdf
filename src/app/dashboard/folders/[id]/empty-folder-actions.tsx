"use client"

import { Button } from "@/components/ui/button"
import { FileText, Plus, Sparkles } from 'lucide-react'
import { useRouter } from "next/navigation"

interface EmptyFolderActionsProps {
  folderId: string
}

export default function EmptyFolderActions({ folderId }: EmptyFolderActionsProps) {
  const router = useRouter()
  
  const handleAddExisting = () => {
    const searchParams = new URLSearchParams()
    searchParams.append('selectFor', 'folder')
    searchParams.append('folderId', folderId)
    router.push(`/dashboard/decks?${searchParams.toString()}`)
  }
  
  const handleCreateManually = () => {
    const searchParams = new URLSearchParams()
    searchParams.append('folderId', folderId)
    router.push(`/dashboard/create?${searchParams.toString()}`)
  }
  
  const handleGenerateWithAI = () => {
    const searchParams = new URLSearchParams()
    searchParams.append('folderId', folderId)
    router.push(`/dashboard/upload?${searchParams.toString()}`)
  }
  
  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <Button 
        variant="outline"
        onClick={handleAddExisting}
      >
        <FileText className="mr-2 h-4 w-4" />
        Add Existing Decks
      </Button>
      <Button 
        variant="outline"
        onClick={handleCreateManually}
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Manually
      </Button>
      <Button 
        className="bg-gradient-to-r from-[#2980B9] via-[#6DD5FA] to-[#FFFFFF] hover:from-[#2980B9] hover:to-[#6DD5FA]"
        onClick={handleGenerateWithAI}
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Generate with AI
      </Button>
    </div>
  )
}
