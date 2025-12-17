"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Edit } from "lucide-react"
import { ColorPicker } from "@/components/folder/color-picker"
import { FolderWithDecks } from "@/lib/types"

interface EditFolderDialogProps {
  folder: FolderWithDecks;
  open?: boolean;
  isOpen?: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditFolderDialog({ folder, open, isOpen, onOpenChange }: EditFolderDialogProps) {
  // For compatibility with both prop styles
  const dialogOpen = open ?? isOpen ?? false;
  const router = useRouter()
  const [name, setName] = useState(folder.name || "")
  const [description, setDescription] = useState(folder.description || "")
  const [color, setColor] = useState(folder.color || "#4F46E5")
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

  // Update local state when folder data changes
  useEffect(() => {
    if (dialogOpen) {
      setName(folder.name || "")
      setDescription(folder.description || "")
      setColor(folder.color || "#4F46E5")
    }
  }, [folder, dialogOpen])

  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    // Validate form
    if (!name.trim()) {
      setError("Folder name is required")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch(`/api/folders/${folder.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          color,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.error || "Failed to update folder")
        throw new Error("Failed to update folder")
      }

      // Close the dialog and refresh the page
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating folder:", error)
      if (!error) {
        setError("An unexpected error occurred")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Folder</DialogTitle>
          <DialogDescription>
            Update the details of your folder.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">Folder Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter folder name"
                className={`bg-white border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 ${error && !name.trim() ? 'border-red-500' : ''}`}
                required
              />
              {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
              )}
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

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#2980B9] via-[#6DD5FA] to-[#FFFFFF] hover:from-[#2980B9] hover:to-[#6DD5FA]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
