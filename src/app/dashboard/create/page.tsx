"use client"

import { useState, useEffect } from "react"
import FlashcardSetForm from "@/components/flashcard-set-form"
import { v4 as uuidv4 } from "uuid";
import { Flashcard } from "@/components/flashcard-item";
import { createDeckAction } from "./createAction";

export default function CreateFlashcardSetPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isSaving, setIsSaving] = useState(false)

  // Initialize flashcards after component mounts to avoid hydration mismatch
  useEffect(() => {
    setFlashcards([
      { id: uuidv4(), term: "", definition: "" },
      { id: uuidv4(), term: "", definition: "" },
    ]);
  }, []);

  const handleAddFlashcard = () => {
    setFlashcards([
      ...flashcards,
      { id: uuidv4(), term: "", definition: "" }
    ]);
  }

  const handleRemoveFlashcard = (id: string) => {
    setFlashcards(flashcards.filter(card => card.id !== id));
  }

  const handleUpdateFlashcard = (id: string, field: "term" | "definition", value: string) => {
    setFlashcards(flashcards.map(card =>
      card.id === id ? { ...card, [field]: value } : card
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      createDeckAction({
        title,
        description,
        flashcards
      })
      
    } catch (err: unknown) {
      // handle error (show toast, etc)
      console.log(err)
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTitle("")
    setDescription("")
    setFlashcards([
      { id: uuidv4(), term: "", definition: "" },
      { id: uuidv4(), term: "", definition: "" },
    ])
  }

  // Don't render until flashcards are initialized to prevent hydration issues
  if (flashcards.length === 0) {
    return null;
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
