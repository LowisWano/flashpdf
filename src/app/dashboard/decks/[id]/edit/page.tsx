"use client"

import FlashcardSetForm from "@/components/flashcard-set-form"
import { getDecks } from "@/services/deck.service"
import { Flashcard as FormFlashcard } from "@/components/flashcard-item"
import { useState } from "react"
import { useRouter } from "next/navigation"

function mapFlashcards(flashcards: { term: string; definition: string }[]): FormFlashcard[] {
  return flashcards.map((card, idx) => ({
    id: `${Date.now()}-${idx}`,
    ...card,
  }))
}

export default function Page({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params
  const decks = getDecks()
  const currentDeck = decks.find((d) => d.id === Number(id))
  const router = useRouter()

  if (!currentDeck) {
    return <div className="p-8 text-center text-lg">Deck not found</div>
  }

  // Local state for editing
  const [title, setTitle] = useState(currentDeck.title)
  const [description, setDescription] = useState(currentDeck.description)
  const [flashcards, setFlashcards] = useState<FormFlashcard[]>(mapFlashcards(currentDeck.flashcards))
  const [isSaving, setIsSaving] = useState(false)

  const addFlashcard = () => {
    const newCard: FormFlashcard = {
      id: Date.now().toString(),
      term: "",
      definition: "",
    }
    setFlashcards([...flashcards, newCard])
  }

  const removeFlashcard = (id: string) => {
    if (flashcards.length > 1) {
      setFlashcards(flashcards.filter((card) => card.id !== id))
    }
  }

  const updateFlashcard = (id: string, field: "term" | "definition", value: string) => {
    setFlashcards(flashcards.map((card) => (card.id === id ? { ...card, [field]: value } : card)))
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      console.log("Updating flashcard set:", { id, title, description, flashcards })
      setIsSaving(false)
      router.push(`/dashboard/decks/${id}`)
    }, 1000)
  }

  const handleCancel = () => {
    router.push(`/dashboard/decks/${id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-white p-4">
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
          onAddFlashcard={addFlashcard}
          onRemoveFlashcard={removeFlashcard}
          onUpdateFlashcard={updateFlashcard}
          onSave={handleSave}
          onCancel={handleCancel}
          isSaving={isSaving}
        />
      </div>
    </div>
  )
}
