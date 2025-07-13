"use client"

import { useState, useEffect } from "react"
import { Folder as FolderIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DialogClose } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { Folder } from "@/generated/prisma"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Label } from "./ui/label"
import { toast } from "sonner"

interface MoveToFolderDialogProps {
  deckId: string;
  currentFolderId: string | null;
  setIsFolderDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MoveToFolderDialog({ 
  deckId, 
  currentFolderId,
  setIsFolderDialogOpen
}: MoveToFolderDialogProps) {
  const [isMoving, setIsMoving] = useState(false)
  const [folders, setFolders] = useState<Folder[]>([])
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(currentFolderId)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Fetch folders
  useEffect(() => {
    async function fetchFolders() {
      try {
        const response = await fetch('/api/folders')
        if (response.ok) {
          const data = await response.json()
          setFolders(data.folders || [])
        }
      } catch (error) {
        console.error('Error fetching folders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFolders()
  }, [])

  const handleMove = async () => {
    setIsMoving(true)
    try {
      // Get the folder name if moving to a folder
      const targetFolder = selectedFolderId ? folders.find(f => f.id === selectedFolderId) : null;
      
      // If selectedFolderId is null, remove from any folder
      if (selectedFolderId === null) {
        if (currentFolderId) {
          const response = await fetch(`/api/folders/${currentFolderId}/decks?deckId=${deckId}`, {
            method: 'DELETE'
          })
          
          if (!response.ok) {
            throw new Error('Failed to remove from folder')
          }
          
          toast.success("Deck removed from folder", {
            description: "Deck has been moved to your main dashboard"
          });
        }
      } else {
        // Move to the selected folder
        const response = await fetch(`/api/folders/${selectedFolderId}/decks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ deckId })
        })
        
        if (!response.ok) {
          throw new Error('Failed to move to folder')
        }
        
        toast.success("Deck moved to folder", {
          description: `Deck has been moved to "${targetFolder?.name || 'selected folder'}"`
        });
      }
      
      setIsFolderDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error moving deck:', error)
      toast.error("Failed to move deck", {
        description: "An unexpected error occurred"
      });
    } finally {
      setIsMoving(false)
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="flex items-center mb-1">
          <FolderIcon className="w-5 h-5 mr-2" />
          Move to Folder
        </DialogTitle>
        <DialogDescription className="text-md">
          Choose a folder to organize this deck
        </DialogDescription>
      </DialogHeader>
      
      {isLoading ? (
        <div className="py-4 text-center">Loading folders...</div>
      ) : folders.length === 0 ? (
        <div className="py-4 text-center">
          <p className="mb-4">You don't have any folders yet.</p>
          <DialogClose asChild>
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard/folders/create')}
            >
              Create a Folder
            </Button>
          </DialogClose>
        </div>
      ) : (
        <RadioGroup 
          value={selectedFolderId || "none"} 
          onValueChange={(val: string) => setSelectedFolderId(val === "none" ? null : val)}
          className="space-y-3 py-2"
        >
          <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50">
            <RadioGroupItem value="none" id="none" />
            <Label htmlFor="none" className="flex items-center cursor-pointer w-full">
              <X className="w-4 h-4 mr-2 text-gray-600" />
              <span>No Folder (Remove from current folder)</span>
            </Label>
          </div>
          
          {folders.map((folder) => (
            <div key={folder.id} className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50">
              <RadioGroupItem value={folder.id} id={folder.id} />
              <Label htmlFor={folder.id} className="flex items-center cursor-pointer w-full">
                <FolderIcon 
                  className="w-4 h-4 mr-2" 
                  style={{ color: folder.color || "#4F46E5" }}
                />
                <span>{folder.name}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" disabled={isMoving}>
            Cancel
          </Button>
        </DialogClose>
        <Button 
          onClick={handleMove}
          disabled={isMoving || isLoading || (selectedFolderId === currentFolderId)}
          className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700"
        >
          {isMoving ? "Moving..." : "Move"}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
