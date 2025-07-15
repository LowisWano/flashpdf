"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Deck as DeckType } from "@/generated/prisma"
import { BookOpen, ArrowLeft, Search, Filter, Check, FileText, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

// Define sort types
type SortOption = "recent" | "name" | null;

export default function DeckSelectionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const folderId = searchParams.get("folderId")
  const selectFor = searchParams.get("selectFor")
  
  const [decks, setDecks] = useState<DeckType[]>([])
  const [selectedDeckIds, setSelectedDeckIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>(null)
  
  useEffect(() => {
    const fetchDecks = async () => {
      try {
        // Fetch decks that are not already in the target folder
        const res = await fetch(`/api/decks?excludeFolderId=${folderId || ""}`)
        if (!res.ok) {
          throw new Error("Failed to fetch decks")
        }
        const data = await res.json()
        setDecks(data)
      } catch (error) {
        console.error("Error fetching decks:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchDecks()
  }, [folderId])
  
  // Filter and sort decks based on search query and sort option
  const filteredDecks = (() => {
    // First filter by search query
    let result = decks
    
    if (searchQuery.trim()) {
      result = result.filter((deck) =>
        deck.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
      )
    }
    
    // Then apply sorting
    if (sortBy) {
      return [...result].sort((a, b) => {
        if (sortBy === "name") {
          return a.title.localeCompare(b.title)
        }
        if (sortBy === "recent") {
          // Sort by lastStudied date, most recent first
          return new Date(b.lastStudied || 0).getTime() - new Date(a.lastStudied || 0).getTime()
        }
        return 0
      })
    }
    
    return result
  })()
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }
  
  const handleSort = (option: SortOption) => {
    setSortBy(option)
  }
  
  const handleDeckSelection = (deckId: string) => {
    setSelectedDeckIds(prev => 
      prev.includes(deckId) 
        ? prev.filter(id => id !== deckId) 
        : [...prev, deckId]
    )
  }
  
  const handleAddToFolder = async () => {
    if (!folderId || selectedDeckIds.length === 0) return
    
    try {
      const res = await fetch(`/api/folders/${folderId}/add-decks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deckIds: selectedDeckIds }),
      })
      
      if (!res.ok) {
        throw new Error("Failed to add decks to folder")
      }
      
      // Navigate back to folder page
      router.push(`/dashboard/folders/${folderId}`)
    } catch (error) {
      console.error("Error adding decks to folder:", error)
    }
  }
  
  const handleBack = () => {
    if (folderId) {
      router.push(`/dashboard/folders/${folderId}`)
    } else {
      router.push("/dashboard")
    }
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Select Decks</h1>
          <p className="text-gray-600">Choose decks to add to your folder</p>
        </div>
        
        {selectedDeckIds.length > 0 && (
          <Button onClick={handleAddToFolder}>
            Add {selectedDeckIds.length} {selectedDeckIds.length === 1 ? 'deck' : 'decks'} to folder
          </Button>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search decks"
            className="pl-10 bg-white border-gray-200 focus:bg-white"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Sort by {sortBy === 'name' ? ': Name' : sortBy === 'recent' ? ': Recently studied' : ''}
              <Filter className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleSort('recent')}>
              <Clock className="w-4 h-4 mr-2" />
              Recently studied
              {sortBy === 'recent' && <span className="ml-2 text-primary">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort('name')}>
              <FileText className="w-4 h-4 mr-2" />
              Name
              {sortBy === 'name' && <span className="ml-2 text-primary">✓</span>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Search info */}
      {(searchQuery.trim() || sortBy) && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {filteredDecks.length === 0 
              ? `No decks found${searchQuery ? ` for "${searchQuery}"` : ''}`
              : `Found ${filteredDecks.length} deck${filteredDecks.length === 1 ? '' : 's'}${searchQuery ? ` for "${searchQuery}"` : ''}${
                  sortBy ? ` sorted by ${sortBy === 'name' ? 'name' : 'recently studied'}` : ''
                }`
            }
          </p>
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-12">
          <p>Loading decks...</p>
        </div>
      ) : filteredDecks.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg bg-white">
          <div className="text-gray-400 mb-4">
            <BookOpen className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No decks available</h3>
          <p className="text-gray-600">
            {searchQuery ? "Try adjusting your search terms." : "All your decks are already in this folder or you don't have any decks yet."}
          </p>
          {!searchQuery && (
            <Button 
              className="mt-4 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700"
              onClick={() => router.push('/dashboard/create')}
            >
              Create a new deck
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDecks.map((deck) => (
            <Card 
              key={deck.id}
              onClick={() => handleDeckSelection(deck.id)}
              className={`cursor-pointer transition-all ${selectedDeckIds.includes(deck.id) ? 'border-primary ring-2 ring-primary ring-opacity-50' : 'hover:border-gray-300 hover:shadow-md'}`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg line-clamp-2 mb-1">{deck.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                      {deck.description || "No description provided"}
                    </p>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <BookOpen className="w-4 h-4 mr-1" />
                      <span>{deck.cardCount || 0} cards</span>
                    </div>
                    
                    {deck.topics && deck.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {deck.topics.slice(0, 2).map((topic) => (
                          <Badge key={topic} variant="outline" className="bg-gray-100">
                            {topic}
                          </Badge>
                        ))}
                        {deck.topics.length > 2 && (
                          <Badge variant="outline" className="bg-gray-100">
                            +{deck.topics.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${selectedDeckIds.includes(deck.id) ? 'bg-primary text-white' : 'border-2 border-gray-300'}`}>
                    {selectedDeckIds.includes(deck.id) && <Check className="w-4 h-4" />}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
