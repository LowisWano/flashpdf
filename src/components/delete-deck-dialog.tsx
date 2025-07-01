"use client"

import { useState } from "react"
import { Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DialogClose } from "@/components/ui/dialog"
import { deleteDeckAction } from "@/app/dashboard/decks/deleteAction"
import { useRouter } from "next/navigation"

interface DeleteDeckDialogProps {
  deckId: string;
  deckTitle: string;
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeleteDeckDialog({ 
  deckId, 
  deckTitle,
  setIsDeleteDialogOpen
}: DeleteDeckDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()


  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteDeckAction(deckId)
      if (result.success) {
        setIsDeleteDialogOpen(false)
        router.refresh()
      } else {
        alert(result.error || 'Failed to delete deck')
      }
    } catch (error) {
      console.error('Error deleting deck:', error)
      alert('An error occurred while deleting the deck')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600 mb-1">
            <Trash2 className="w-5 h-5 mr-2" />
            Delete this deck?
          </DialogTitle>
          <DialogDescription className="text-md">
            {deckTitle}
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-800 mb-1">Warning: This action cannot be undone</h4>
              <p className="text-sm text-red-700">
                You are about to delete this set and all of its data. No one will be able to access this set ever again.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isDeleting}>
              Cancel
            </Button>
          </DialogClose>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete Deck"}
          </Button>
        </DialogFooter>
      </DialogContent>
  )
} 