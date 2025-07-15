"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AddDeckToFolderButtonProps {
  folderId: string
}

export default function AddDeckToFolderButton({ folderId }: AddDeckToFolderButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  
  const handleAddExistingDeck = () => {
    // Close dialog and navigate to the deck selection page
    setOpen(false)
    router.push(`/dashboard/decks?selectFor=folder&folderId=${folderId}`)
  }
  
  const handleCreateNewDeck = () => {
    // Close dialog and navigate to create page with folder preselected
    setOpen(false)
    router.push(`/dashboard/create?folderId=${folderId}`)
  }
  
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Decks to Folder
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Decks to Folder</DialogTitle>
            <DialogDescription>
              Choose whether to add existing decks or create a new deck in this folder.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-4">
            <Button
              onClick={handleAddExistingDeck}
              variant="outline"
              className="justify-start text-left h-auto py-3"
            >
              <div>
                <h3 className="font-medium">Add Existing Decks</h3>
                <p className="text-sm text-gray-500 font-normal">
                  Select from your existing decks to add to this folder
                </p>
              </div>
            </Button>
            
            <Button
              onClick={handleCreateNewDeck}
              variant="outline"
              className="justify-start text-left h-auto py-3"
            >
              <div>
                <h3 className="font-medium">Create New Deck</h3>
                <p className="text-sm text-gray-500 font-normal">
                  Create a new flashcard deck in this folder
                </p>
              </div>
            </Button>
          </div>
          
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
