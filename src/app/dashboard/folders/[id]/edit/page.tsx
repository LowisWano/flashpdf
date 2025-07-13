"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import FolderForm from "@/components/folder-form"
import { updateFolderAction } from "../../actions"
import { toast } from "sonner"

export default function EditFolderPage() {
  // Use useParams hook to get the folder ID
  const params = useParams()
  const folderId = params?.id as string
  
  const router = useRouter()
  const [folder, setFolder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [color, setColor] = useState("#4F46E5")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function fetchFolder() {
      try {
        const response = await fetch(`/api/folders/${folderId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch folder')
        }
        const data = await response.json()
        setFolder(data.folder)
        setName(data.folder.name)
        setDescription(data.folder.description || "")
        setColor(data.folder.color || "#4F46E5")
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchFolder()
  }, [folderId])

  const handleSave = async () => {
    if (!name.trim()) return

    setIsSaving(true)
    try {
      const result = await updateFolderAction(folderId, {
        name,
        description,
        color
      })
      
      if (result && result.success === false) {
        toast.error("Failed to update folder", { 
          description: result.error || "Please try again"
        })
      } else {
        toast.success("Folder updated successfully", { 
          description: `"${name}" has been updated`
        })
        
        // Wait a moment to show the toast before redirecting
        setTimeout(() => {
          router.push(`/dashboard/folders/${folderId}`)
        }, 1000)
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to update folder", { 
        description: "An unexpected error occurred"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    router.push(`/dashboard/folders/${folderId}`)
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>
  }

  return (
    <div>
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 drop-shadow-sm">Edit Folder</h1>
          <p className="mt-2 text-gray-600 text-lg">Update your folder details</p>
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
