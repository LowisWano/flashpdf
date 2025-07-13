"use client"

import { useState } from "react"
import FolderForm from "@/components/folder-form"
import { createFolderAction } from "../actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function CreateFolderPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [color, setColor] = useState("#4F46E5") // Default color
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) return

    setIsSaving(true)
    try {
      const result = await createFolderAction({
        name,
        description,
        color
      })
      
      if (result && result.success === false) {
        toast.error("Failed to create folder", { 
          description: result.error || "Please try again"
        })
      } else {
        toast.success("Folder created successfully", { 
          description: `"${name}" has been created`
        })
        
        // Wait a moment to show the toast before redirecting
        setTimeout(() => {
          router.push("/dashboard/folders")
        }, 1000)
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to create folder", { 
        description: "An unexpected error occurred"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    router.push("/dashboard/folders")
  }

  return (
    <div>
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 drop-shadow-sm">Create Folder</h1>
          <p className="mt-2 text-gray-600 text-lg">Organize your flashcard collections</p>
        </div>
        <FolderForm
          name={name}
          description={description}
          color={color}
          onNameChange={setName}
          onDescriptionChange={setDescription}
          onColorChange={setColor}
          onSave={handleSave}
          onCancel={handleCancel}
          isSaving={isSaving}
        />
      </div>
    </div>
  )
}
