"use client"

import { useSearchParams, useRouter, useParams } from "next/navigation"
import DecksSection from "@/components/decks-section"
import { Deck } from "@/generated/prisma"
import { useEffect, useState } from "react"

export default function DecksPage() {
  const params = useParams<{ folderId?: string, selectFor?: string, excludeFolderId?: string }>()
  const folderId = params.folderId
  const selectFor = params.selectFor
  const excludeFolderId = params.excludeFolderId
  
  const [decks, setDecks] = useState<Deck[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    async function loadDecks() {
      try {
        setIsLoading(true)
        // Fetch decks from API endpoint
        const url = excludeFolderId 
          ? `/api/decks?excludeFolderId=${excludeFolderId}` 
          : '/api/decks'
          
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error("Failed to fetch decks")
        }
        
        const decksData = await response.json()
        setDecks(decksData)
      } catch (err) {
        setError("Failed to load decks")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadDecks()
  }, [excludeFolderId])
  
  // Define the page title based on the context
  const pageTitle = selectFor === 'folder' 
    ? "Select Decks to Add to Folder" 
    : "My Flashcard Decks"
    
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading decks...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }
  
  return (
    <div>
      <h1 className="scroll-m-20 font-bold text-2xl tracking-tighter md:text-4xl relative mb-4 flex items-center gap-4">
        {pageTitle}
      </h1>
      <DecksSection 
        decks={decks} 
        currentFolderId={folderId || undefined}
      />
    </div>
  )
}
