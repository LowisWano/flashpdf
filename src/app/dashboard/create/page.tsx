"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import FlashcardSetForm from "@/components/flashcard-set-form"
import { addFlashcard, removeFlashcard, updateFlashcard } from "@/services/deck.service"
import type { DraftFlashcard as Flashcard } from "@/services/deck.service"

export default function CreateFlashcardSetPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    { id: "1", term: "", definition: "" },
    { id: "2", term: "", definition: "" },
  ])
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const handleAddFlashcard = () => {
    setFlashcards(addFlashcard(flashcards))
  }

  const handleRemoveFlashcard = (id: string) => {
    setFlashcards(removeFlashcard(flashcards, id))
  }

  const handleUpdateFlashcard = (id: string, field: "term" | "definition", value: string) => {
    setFlashcards(updateFlashcard(flashcards, id, field, value))
  }

  const handleSave = async () => {
    if (flashcards.length < 2) {
      alert("You need at least 2 flashcards to create a deck.")
      return
    }
    setIsSaving(true)
    try {
      const res = await fetch("/api/decks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          topics: [],
          flashcards: flashcards.map(({ term, definition }) => ({ term, definition })),
        }),
      })
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error || "Failed to save")
      }
      router.push("/dashboard")
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setTitle("")
    setDescription("")
    setFlashcards([
      { id: "1", term: "", definition: "" },
      { id: "2", term: "", definition: "" },
    ])
  }

  return (
    <div>
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
