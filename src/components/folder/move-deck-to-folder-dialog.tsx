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
import { FolderOpen, Loader2 } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { FolderWithDecks } from "@/lib/types"
import { createClient } from "@/utils/supabase/client"

interface MoveDeckToFolderDialogProps {
  deckId: string;
  deckTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MoveDeckToFolderDialog({ 
  deckId, 
  deckTitle, 
  open, 
  onOpenChange 
}: MoveDeckToFolderDialogProps) {
  const router = useRouter()
  const [folders, setFolders] = useState<FolderWithDecks[]>([])
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMoving, setIsMoving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch all folders when dialog opens
  useEffect(() => {
    if (open) {
      fetchFolders()
    }
  }, [open])
  
  const fetchFolders = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const supabase = createClient()
      const { data: userData, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        throw new Error("User authentication error")
      }
      
      // Fetch folders for the current user
      const response = await fetch('/api/folders')
      if (!response.ok) {
        throw new Error("Failed to fetch folders")
      }
      
      const folderData = await response.json()
      setFolders(folderData)
      
      // Find current folder of the deck
      const deckResponse = await fetch(`/api/decks/${deckId}`)
      if (deckResponse.ok) {
        const deckData = await deckResponse.json()
        setSelectedFolderId(deckData.folderId || null)
      }
      
    } catch (error) {
      console.error("Error fetching folders:", error)
      setError("Failed to load folders. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleMoveDeck = async () => {
    setIsMoving(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/decks/${deckId}/move-to-folder`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          folderId: selectedFolderId
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to move deck")
      }
      
      // Close dialog and refresh page to show changes
      onOpenChange(false)
      router.refresh()
      
    } catch (error) {
      console.error("Error moving deck:", error)
      setError("Failed to move the deck. Please try again.")
    } finally {
      setIsMoving(false)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Move Deck to Folder</DialogTitle>
          <DialogDescription>
            Select a folder to move "{deckTitle}" to, or remove it from its current folder.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2">Loading folders...</span>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            {folders.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <FolderOpen className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <p className="text-gray-600 mb-4">You don't have any folders yet.</p>
                <Button 
                  onClick={() => {
                    onOpenChange(false)
                    router.push("/dashboard/folders")
                  }}
                >
                  Create a Folder
                </Button>
              </div>
            ) : (
              <RadioGroup 
                value={selectedFolderId || ""} 
                onValueChange={(value) => setSelectedFolderId(value === "none" ? null : value)}
                className="space-y-3 py-4"
              >
                <div className="flex items-center space-x-3 px-3 py-2 border rounded-md hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none" className="cursor-pointer flex-1">
                    No folder (remove from current folder)
                  </Label>
                </div>
                
                {folders.map((folder) => (
                  <div 
                    key={folder.id}
                    className={`flex items-center space-x-3 px-3 py-2 border rounded-md hover:bg-gray-50 cursor-pointer ${selectedFolderId === folder.id ? 'bg-gray-50 border-gray-300' : ''}`}
                  >
                    <RadioGroupItem value={folder.id} id={folder.id} />
                    <div 
                      className="w-5 h-5 rounded"
                      style={{ backgroundColor: folder.color || '#4F46E5' }}
                    ></div>
                    <Label htmlFor={folder.id} className="cursor-pointer flex-1">
                      <div className="flex items-center">
                        <span>{folder.name}</span>
                        {selectedFolderId === folder.id && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Current</span>
                        )}
                      </div>
                      {folder.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{folder.description}</p>
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </>
        )}
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isMoving}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleMoveDeck}
            disabled={isMoving || isLoading || folders.length === 0}
            className="bg-gradient-to-r from-[#2980B9] via-[#6DD5FA] to-[#FFFFFF] hover:from-[#2980B9] hover:to-[#6DD5FA]"
          >
            {isMoving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Moving...
              </>
            ) : "Move Deck"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
