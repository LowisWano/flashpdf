"use client"
import FlashCard from "./flashcard"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function FlashcardsSection({
  flashcards
}: {
  flashcards: {
    term: string,
    definition: string,
  }[]
}){
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < flashcards.length - 1 ? prev + 1 : 0))
  }

  if(flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M3 9h18" />
            <path d="M9 21V9" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No Flashcards Yet</h3>
        <p className="text-muted-foreground max-w-sm">
          This deck is empty. Add some flashcards to get started with your study session.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <FlashCard key={flashcards[currentIndex].term} flashcard={flashcards[currentIndex]}/>

      <div className="flex items-center justify-center gap-4">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <span className="text-sm text-muted-foreground">
          Card {currentIndex + 1} of {flashcards.length}
        </span>

        <Button 
          variant="outline" 
          onClick={handleNext}
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}