"use client"

import FlashcardSetForm from "@/components/flashcard-set-form"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Deck, Flashcard } from "@/generated/prisma"

interface EditDeckFormProps {
  deckId: string
  deck: Deck
}

function addFlashcard(flashcards: Flashcard[]): Flashcard[] {
  const newCard: Flashcard = {
    id: "1",
    term: "add",
    definition: "definition",
    deckId: "1"
  }
  return [...flashcards, newCard]
}

function updateFlashcard(
  flashcards: Flashcard[], 
  id: string, 
  field: "term" | "definition", 
  value: string
): Flashcard[] {
  return flashcards.map((card) => 
    card.id === id ? { ...card, [field]: value } : card
  )
}

function removeFlashcard(flashcards: Flashcard[], id: string): Flashcard[] {
  if (flashcards.length > 1) {
    return flashcards.filter((card) => card.id !== id)
  }
  return flashcards
}

export default function EditDeckForm({ deckId, deck }: EditDeckFormProps) {
  const router = useRouter()
  
  const [title, setTitle] = useState(deck.title)
  const [description, setDescription] = useState(deck.description)
  const [flashcards, setFlashcards] = useState<Flashcard[]>(deck.flashcards)
  const [isSaving, setIsSaving] = useState(false)

  const handleAddFlashcard = () => {
    setFlashcards(addFlashcard(flashcards))
  }

  const handleRemoveFlashcard = (id: string) => {
    setFlashcards(removeFlashcard(flashcards, id))
  }

  const handleUpdateFlashcard = (id: string, field: "term" | "definition", value: string) => {
    setFlashcards(updateFlashcard(flashcards, id, field, value))
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      console.log("Updating flashcard set:", { id: deckId, title, description, flashcards })
      setIsSaving(false)
      router.push(`/dashboard/decks/${deckId}`)
    }, 1000)
  }

  const handleCancel = () => {
    router.push(`/dashboard/decks/${deckId}`)
  }

  return (
    <div className="">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 drop-shadow-sm">Edit Flashcard Set</h1>
          <p className="mt-2 text-gray-600 text-lg">Modify your flashcard collection</p>
        </div>
        <FlashcardSetForm
          title={title}
          description={description}
          flashcards={flashcards}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onAddFlashcard={handleAddFlashcard}
          onRemoveFlashcard={handleRemoveFlashcard}
          onUpdateFlashcard={handleUpdateFlashcard}
          onSave={handleSave}
          onCancel={handleCancel}
          isSaving={isSaving}
        />
      </div>
    </div>
  )
}
