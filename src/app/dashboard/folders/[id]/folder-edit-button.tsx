"use client"

import { useState } from "react"
import { Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import EditFolderDialog from "@/components/edit-folder-dialog"
import { FolderWithDecks } from "@/lib/types"

interface FolderEditButtonProps {
  folder: FolderWithDecks
}

export default function FolderEditButton({ folder }: FolderEditButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button 
        variant="ghost" 
        className="h-8 w-8 p-0"
        onClick={() => setOpen(true)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      
      <EditFolderDialog 
        folder={folder}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
