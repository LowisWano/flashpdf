"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { ColorPicker } from "@/components/color-picker"

interface CreateFolderDialogProps {
  open?: boolean
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function CreateFolderDialog({
  open,
  isOpen: externalIsOpen,
  onOpenChange
}: CreateFolderDialogProps = {}) {
  const router = useRouter()
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  
  // Use external state control if provided, otherwise use internal state
  const dialogOpen = open ?? externalIsOpen ?? internalIsOpen
  const setIsOpen = onOpenChange ?? setInternalIsOpen
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [color, setColor] = useState("#4F46E5") // Default color
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError) {
        throw new Error("User authentication error")
      }

      const response = await fetch("/api/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          color,
          userId: userData.user.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create folder")
      }

      // Close the dialog and reset form
      setIsOpen(false)
      setName("")
      setDescription("")
      setColor("#4F46E5")
      
      // Refresh the page to show the new folder
      router.refresh()
    } catch (error) {
      console.error("Error creating folder:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      // Reset form when dialog is closed
      setName("")
      setDescription("")
      setColor("#4F46E5")
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {!onOpenChange && (
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            New Folder
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>
            Create a new folder to organize your flashcard decks.
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

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Folder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
