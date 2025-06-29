"use client"

import FlashcardSetForm from "@/components/flashcard-set-form"
import {
  DeckWithFlashcards as Deck,
  DraftFlashcard as Flashcard,
  addFlashcard,
  removeFlashcard,
  updateFlashcard,
} from "@/services/deck.service"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface EditDeckFormProps {
  deckId: string
  deck: Deck
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
