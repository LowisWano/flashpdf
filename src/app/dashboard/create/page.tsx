"use client"

import { useState } from "react"
import FlashcardSetForm from "@/components/flashcard-set-form"
import { Flashcard } from "@/components/flashcard-item"

export default function CreateFlashcardSetPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    { id: "1", term: "", definition: "" },
    { id: "2", term: "", definition: "" },
  ])
  const [isSaving, setIsSaving] = useState(false)

  const addFlashcard = () => {
    const newCard: Flashcard = {
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
    // Simulate save logic
    setTimeout(() => {
      console.log("Saving flashcard set:", { title, description, flashcards })
      setIsSaving(false)
    }, 1000)
  }

  const handleCancel = () => {
    // Reset form or navigate away
    setTitle("")
    setDescription("")
    setFlashcards([
      { id: "1", term: "", definition: "" },
      { id: "2", term: "", definition: "" },
    ])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-white p-4">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 drop-shadow-sm">Create Flashcard Set</h1>
          <p className="mt-2 text-gray-600 text-lg">Build your custom flashcard collection</p>
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
