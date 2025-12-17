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
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, FolderOpen } from "lucide-react"
import { Deck } from "@/generated/prisma"
import { FolderWithDecks } from "@/lib/types"
import { createClient } from "@/utils/supabase/client"

interface BulkMoveDeckToFolderDialogProps {
  decks: Deck[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  excludeFolderId?: string;
}

export default function BulkMoveDeckToFolderDialog({
  decks,
  open,
  onOpenChange,
  excludeFolderId
}: BulkMoveDeckToFolderDialogProps) {
  const router = useRouter()
  const [folders, setFolders] = useState<FolderWithDecks[]>([])
  const [selectedDeckIds, setSelectedDeckIds] = useState<string[]>([])
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMoving, setIsMoving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    if (open) {
      fetchFolders()
      setSelectedDeckIds([]) // Reset selection when dialog opens
    }
  }, [open])
  
  const fetchFolders = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Fetch folders for the current user
      const response = await fetch('/api/folders')
      if (!response.ok) {
        throw new Error("Failed to fetch folders")
      }
      
      let folderData = await response.json()
      
      // Filter out the current folder if we're in a folder view
      if (excludeFolderId) {
        folderData = folderData.filter((folder: FolderWithDecks) => folder.id !== excludeFolderId)
      }
      
      setFolders(folderData)
    } catch (error) {
      console.error("Error fetching folders:", error)
      setError("Failed to load folders. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  
  const toggleDeckSelection = (deckId: string) => {
    setSelectedDeckIds(prev => 
      prev.includes(deckId) 
        ? prev.filter(id => id !== deckId)
        : [...prev, deckId]
    )
  }
  
  const handleMoveDecks = async () => {
    if (selectedDeckIds.length === 0) {
      setError("Please select at least one deck")
      return
    }
    
    if (selectedFolderId === undefined) {
      setError("Please select a destination folder")
      return
    }
    
    setIsMoving(true)
    setError(null)
    
    try {
      // Process each deck move sequentially
      const movePromises = selectedDeckIds.map(deckId => 
        fetch(`/api/decks/${deckId}/move-to-folder`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            folderId: selectedFolderId
          }),
        })
      )
      
      // Wait for all moves to complete
      const results = await Promise.all(movePromises)
      
      // Check if any move failed
      const hasFailure = results.some(response => !response.ok)
      if (hasFailure) {
        throw new Error("Some decks could not be moved")
      }
      
      // Close dialog and refresh page to show changes
      onOpenChange(false)
      router.push(`/dashboard/folders/${selectedFolderId}`) 
      router.refresh()
      
    } catch (error) {
      console.error("Error moving decks:", error)
      setError("Failed to move one or more decks. Please try again.")
    } finally {
      setIsMoving(false)
    }
  }
  
  const selectAllDecks = () => {
    setSelectedDeckIds(decks.map(deck => deck.id))
  }
  
  const clearSelection = () => {
    setSelectedDeckIds([])
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Move Decks to Folder</DialogTitle>
          <DialogDescription>
            Select decks and a destination folder.
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
            
            <div className="grid gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Select Decks</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={selectAllDecks}
                      className="text-xs h-7"
                    >
                      Select All
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearSelection}
                      className="text-xs h-7"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
                
                <div className="max-h-40 overflow-y-auto border rounded-md p-2 space-y-2">
                  {decks.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No decks available</p>
                  ) : (
                    decks.map(deck => (
                      <div key={deck.id} className="flex items-center space-x-2 py-1">
                        <Checkbox 
                          id={`deck-${deck.id}`} 
                          checked={selectedDeckIds.includes(deck.id)}
                          onCheckedChange={() => toggleDeckSelection(deck.id)}
                        />
                        <Label 
                          htmlFor={`deck-${deck.id}`}
                          className="flex-1 cursor-pointer flex items-center"
                        >
                          <span className="line-clamp-1">{deck.title}</span>
                          {deck.folderId && (
                            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                              In folder
                            </span>
                          )}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Select Destination</h3>
                
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
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-3 px-3 py-2 border rounded-md hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="none" id="folder-none" />
                      <Label htmlFor="folder-none" className="cursor-pointer flex-1">
                        No folder (remove from current folder)
                      </Label>
                    </div>
                    
                    {folders.map((folder) => (
                      <div 
                        key={folder.id}
                        className="flex items-center space-x-3 px-3 py-2 border rounded-md hover:bg-gray-50 cursor-pointer"
                      >
                        <RadioGroupItem value={folder.id} id={`folder-${folder.id}`} />
                        <div 
                          className="w-5 h-5 rounded"
                          style={{ backgroundColor: folder.color || '#4F46E5' }}
                        ></div>
                        <Label htmlFor={`folder-${folder.id}`} className="cursor-pointer flex-1">
                          <span>{folder.name}</span>
                          {folder.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{folder.description}</p>
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>
            </div>
          </>
        )}
        
        <DialogFooter className="gap-2 sm:gap-0">
          <div className="flex-1 text-xs text-gray-500">
            {selectedDeckIds.length} deck{selectedDeckIds.length !== 1 ? 's' : ''} selected
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isMoving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleMoveDecks}
              disabled={isMoving || isLoading || folders.length === 0 || selectedDeckIds.length === 0}
              className="bg-gradient-to-r from-[#2980B9] via-[#6DD5FA] to-[#FFFFFF] hover:from-[#2980B9] hover:to-[#6DD5FA]"
            >
              {isMoving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Moving...
                </>
              ) : "Move Selected"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
