"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import DeleteFolderDialog from "@/components/delete-folder-dialog"

interface DeleteFolderButtonProps {
  folderId: string
  folderName: string
}

export default function DeleteFolderButton({ folderId, folderName }: DeleteFolderButtonProps) {
  const [open, setOpen] = useState(false)
  
  return (
    <>
      <Button 
        variant="outline" 
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete Folder
      </Button>
      
      <DeleteFolderDialog 
        folderId={folderId} 
        folderName={folderName}
        isOpen={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
