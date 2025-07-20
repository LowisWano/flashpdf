"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import CreateFolderDialog from "@/components/folder/create-folder-dialog"

export default function CreateFolderButton() {
  const [open, setOpen] = useState(false)
  
  // Add keyboard shortcut support for "n" key to create new folder
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'n' && (e.ctrlKey || e.metaKey)) {
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
        className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700"
        onClick={() => setOpen(true)}
        title="Create Folder (Ctrl/Cmd+N)"
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Folder
      </Button>
      
      <CreateFolderDialog 
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
