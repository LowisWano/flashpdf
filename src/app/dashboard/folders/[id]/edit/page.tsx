"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ColorPicker } from "@/components/folder/color-picker"
import { createClient } from "@/utils/supabase/client"
import { FolderWithDecks } from "@/lib/types"

export default function EditFolderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = params
  const router = useRouter()
  const [folder, setFolder] = useState<FolderWithDecks | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [color, setColor] = useState("#4F46E5")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const colors = [
    { value: "#4F46E5", label: "Indigo" },
    { value: "#2563EB", label: "Blue" },
    { value: "#0891B2", label: "Cyan" },
    { value: "#059669", label: "Emerald" },
    { value: "#65A30D", label: "Lime" },
    { value: "#CA8A04", label: "Yellow" },
    { value: "#D97706", label: "Amber" },
    { value: "#DC2626", label: "Red" },
    { value: "#E11D48", label: "Rose" },
    { value: "#7C3AED", label: "Violet" },
  ]

  useEffect(() => {
    const fetchFolder = async () => {
      try {
        const response = await fetch(`/api/folders/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch folder")
        }
        
        const folderData = await response.json()
        setFolder(folderData)
        setName(folderData.name || "")
        setDescription(folderData.description || "")
        setColor(folderData.color || "#4F46E5")
      } catch (error) {
        console.error("Error fetching folder:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFolder()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/folders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          color,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update folder")
      }

      router.push(`/dashboard/folders/${id}`)
    } catch (error) {
      console.error("Error updating folder:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="container mx-auto max-w-3xl py-10">Loading folder information...</div>
  }

  if (!folder) {
    return <div className="container mx-auto max-w-3xl py-10">Folder not found</div>
  }

  return (
    <div className="container mx-auto max-w-3xl py-10">
      <div className="flex items-center mb-8">
        <Link href={`/dashboard/folders/${id}`} className="mr-4">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Folder</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base">Folder Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter folder name"
              className="bg-white border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description for your folder"
              rows={3}
              className="bg-white border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base">Folder Color</Label>
            <ColorPicker
              value={color}
              onChange={setColor}
              colors={colors}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Link href={`/dashboard/folders/${id}`}>
            <Button variant="outline" className="border-gray-300" disabled={isSubmitting}>
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}
