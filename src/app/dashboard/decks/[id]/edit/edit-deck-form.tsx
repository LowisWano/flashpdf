"use client"

import FlashcardSetForm from "@/components/flashcard-set-form"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Deck, Flashcard } from "@/generated/prisma"
import { editDeck } from "./actions"

interface EditDeckFormProps {
  deckId: string
  deck: any // Using any temporarily to fix type issues
}


// implement database query for add flashcard here.
export function addFlashcard(flashcards: Flashcard[], deckId: string): Flashcard[] {
  // Find max id (as number) among flashcards, fallback to 0 if none
  const maxId = flashcards.length > 0 ? Math.max(...flashcards.map(card => Number(card.id) || 0)) : 0
  const newCard: Flashcard = {
    id: (maxId + 1).toString(),
    term: "",
    definition: "",
    deckId: deckId
  }
  return [...flashcards, newCard]
}

// implement database query for update flashcard here.
export function updateFlashcard(
  flashcards: Flashcard[], 
  id: string, 
  field: "term" | "definition", 
  value: string
): Flashcard[] {
  return flashcards.map((card) => 
    card.id === id ? { ...card, [field]: value } : card
  )
}

// implement database query for remove flashcard here.
export function removeFlashcard(flashcards: Flashcard[], id: string): Flashcard[] {
  if (flashcards.length > 1) {
    return flashcards.filter((card) => card.id !== id)
  }
  return flashcards
}

export default function EditDeckForm({ deckId, deck }: EditDeckFormProps) {
  const router = useRouter()
  
  const [title, setTitle] = useState(deck.title)
  const [description, setDescription] = useState(deck.description)
  const [tags, setTags] = useState<string[]>(deck.topics || [])
  const [flashcards, setFlashcards] = useState<Flashcard[]>(deck.flashcards)
  const [isSaving, setIsSaving] = useState(false)

  const handleAddFlashcard = () => {
    setFlashcards(addFlashcard(flashcards, deckId))
  }

  const handleRemoveFlashcard = (id: string) => {
    setFlashcards(removeFlashcard(flashcards, id))
  }

  const handleUpdateFlashcard = (id: string, field: "term" | "definition", value: string) => {
    setFlashcards(updateFlashcard(flashcards, id, field, value))
  }

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await editDeck(deckId, {
        title,
        description,
        topics: tags,
        flashcards: flashcards.map(({ id, term, definition }) => ({ id, term, definition })),
      })
      router.push(`/dashboard/decks/${deckId}`)
    } catch (e) {
      // Optionally handle error
      setIsSaving(false)
    }
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
          tags={tags}
          flashcards={flashcards}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
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
