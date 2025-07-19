"use client"

import { useState, useEffect } from "react"
import { Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import EditFolderDialog from "@/components/folder/edit-folder-dialog"
import { FolderWithDecks } from "@/lib/types"

interface FolderEditButtonProps {
  folder: FolderWithDecks
}

export default function FolderEditButton({ folder }: FolderEditButtonProps) {
  const [open, setOpen] = useState(false)
  
  // Add keyboard shortcut support for "e" key to open edit dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'e' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setOpen(true)
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <Button 
        variant="outline" 
        className="flex items-center hover:bg-gray-100"
        onClick={() => setOpen(true)}
        title="Edit Folder (Ctrl/Cmd+E)"
      >
        <Edit className="h-4 w-4 mr-2" />
        <span>Edit Folder</span>
      </Button>
      
      <EditFolderDialog 
        folder={folder}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
