"use client"

import { useState } from "react"
import FlashcardSetForm from "@/components/flashcard-set-form"
import { v4 as uuidv4 } from "uuid";
import { Flashcard } from "@/components/flashcard-item";
import { createDeckInFolderAction } from "./createAction";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateFlashcardSetInFolderPage() {
  const params = useParams();
  const folderId = params.id as string;
  const router = useRouter();
  
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => [
    { id: uuidv4(), term: "", definition: "" },
    { id: uuidv4(), term: "", definition: "" },
  ]);
  const [isSaving, setIsSaving] = useState(false)

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

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  }

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsSaving(true);
    try {
      // Show success message before the action, as the action will redirect
      toast.success("Creating deck...");
      
      await createDeckInFolderAction({
        title,
        description,
        topics: tags,
        flashcards,
        folderId
      });
      
      // The server action will handle the redirect, so we don't need to do it here
      // If the code reaches here, it means there was no redirect, which is unexpected
      
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to create deck", { 
        description: "An unexpected error occurred"
      });
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/folders/${folderId}`);
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
