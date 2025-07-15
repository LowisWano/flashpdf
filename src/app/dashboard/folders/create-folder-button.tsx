"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import CreateFolderDialog from "@/components/create-folder-dialog"

export default function CreateFolderButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button 
        className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700"
        onClick={() => setOpen(true)}
      >
        Create Folder
      </Button>
      
      <CreateFolderDialog 
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
