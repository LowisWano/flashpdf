"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface DeleteFolderDialogProps {
  folderId: string
  folderName: string
  open?: boolean
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function DeleteFolderDialog({
  folderId,
  folderName,
  open,
  isOpen: externalIsOpen,
  onOpenChange
}: DeleteFolderDialogProps) {
  const router = useRouter()
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Use external state control if provided, otherwise use internal state
  const dialogOpen = open ?? externalIsOpen ?? internalIsOpen
  const setIsOpen = onOpenChange ?? setInternalIsOpen
  
  // If we're using controlled mode, don't render the trigger
  const shouldRenderTrigger = open === undefined && externalIsOpen === undefined

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/folders/${folderId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete folder")
      }

      // Close the dialog and redirect to folders page
      setIsOpen(false)
      router.push("/dashboard/folders")
      router.refresh()
    } catch (error) {
      console.error("Error deleting folder:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setIsOpen}>
      {shouldRenderTrigger && (
        <DialogTrigger asChild>
          <div className="flex text-red-600 ml-2 cursor-pointer">
            <Trash2 className="mr-4 mt-1 h-4 w-4" />
            <span>Delete</span>
          </div>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Folder</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the folder "{folderName}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex space-x-2 justify-end">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
