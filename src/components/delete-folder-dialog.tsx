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
import { deleteFolderAction } from "@/app/dashboard/folders/actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface DeleteFolderDialogProps {
  folderId: string;
  folderName: string;
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeleteFolderDialog({ 
  folderId, 
  folderName,
  setIsDeleteDialogOpen
}: DeleteFolderDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteFolderAction(folderId)
      if (result.success) {
        setIsDeleteDialogOpen(false)
        toast.success("Folder deleted", {
          description: `"${folderName}" has been deleted`
        })
        router.refresh()
      } else {
        toast.error("Failed to delete folder", {
          description: result.error || 'Please try again'
        })
      }
    } catch (error) {
      console.error('Error deleting folder:', error)
      toast.error("Error deleting folder", {
        description: 'An unexpected error occurred'
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <DialogContent className="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle className="flex items-center text-red-600 mb-1">
          <Trash2 className="w-5 h-5 mr-2" />
          Delete this folder?
        </DialogTitle>
        <DialogDescription className="text-md">
          {folderName}
        </DialogDescription>
      </DialogHeader>
      
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-red-800 mb-1">Warning: This action cannot be undone</h4>
            <p className="text-sm text-red-700">
              You are about to delete this folder. The decks inside the folder will not be deleted, but will be moved to your main dashboard.
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
          {isDeleting ? "Deleting..." : "Delete Folder"}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
