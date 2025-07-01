"use client"

import { useState } from "react"
import { Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { deleteDeckAction } from "@/app/dashboard/decks/actions"
import { useRouter } from "next/navigation"

interface DeleteDeckDialogProps {
  deckId: string
  deckTitle: string
  isOpen: boolean
  onClose: () => void
}

export default function DeleteDeckDialog({ 
  deckId, 
  deckTitle, 
  isOpen, 
  onClose 
}: DeleteDeckDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteDeckAction(deckId)
      onClose()
      if (result.success) {
        onClose()
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
   
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600">
            <Trash2 className="w-5 h-5 mr-2" />
            Delete Deck
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{deckTitle}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-800 mb-1">Warning: This action cannot be undone</h4>
              <p className="text-sm text-red-700">
                Deleting this deck will permanently remove:
              </p>
              <ul className="text-sm text-red-700 mt-2 space-y-1">
                <li>• All flashcards in this deck</li>
                <li>• Study progress and statistics</li>
                <li>• Any shared links or exports</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
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