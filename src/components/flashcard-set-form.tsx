import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import FlashcardItem, { Flashcard } from "./flashcard-item"
import React, { KeyboardEvent } from "react"
import { Badge } from "@/components/ui/badge"

interface FlashcardSetFormProps {
  title: string
  description: string
  tags: string[]
  flashcards: Flashcard[]
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
  onAddFlashcard: () => void
  onRemoveFlashcard: (id: string) => void
  onUpdateFlashcard: (id: string, field: "term" | "definition", value: string) => void
  onSave: () => void
  onCancel?: () => void
  isSaving?: boolean
}

const FlashcardSetForm: React.FC<FlashcardSetFormProps> = ({
  title,
  description,
  tags,
  flashcards,
  onTitleChange,
  onDescriptionChange,
  onAddTag,
  onRemoveTag,
  onAddFlashcard,
  onRemoveFlashcard,
  onUpdateFlashcard,
  onSave,
  onCancel,
  isSaving = false,
}) => {
  const [tagInput, setTagInput] = React.useState<string>("");

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      onAddTag(tagInput.trim());
      setTagInput("");
    }
  };

  return (
    <div className="space-y-8 relative">
      {isSaving && (
        <div className="absolute inset-0 bg-white/50 z-10 rounded-lg cursor-not-allowed" />
      )}
      {/* Main Form */}
      <Card className="shadow-lg border border-gray-100">
        <CardHeader>
          <CardTitle className="text-2xl">Flashcard Set Details</CardTitle>
          <CardDescription className="text-base">Enter the basic information for your flashcard set</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base">Title</Label>
            <Input
              id="title"
              placeholder="Enter flashcard set title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="bg-white border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter a description for your flashcard set"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              rows={3}
              className="bg-white border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-base">Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} className="bg-cyan-400 text-white flex items-center gap-1 px-3 py-1">
                  {tag}
                  <button 
                    type="button" 
                    onClick={() => onRemoveTag(tag)} 
                    className="ml-1 hover:text-gray-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              id="tags"
              placeholder="Add tags (press Enter to add)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className="bg-white border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            />
            <p className="text-xs text-gray-500 mt-1">Press Enter to add a tag</p>
          </div>
        </CardContent>
      </Card>

      {/* Flashcards Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Flashcards</h2>
        <p className="text-gray-600 mb-6">Create your flashcard terms and definitions</p>
      </div>

      {/* Individual Flashcards */}
      <div className="space-y-4">
        {flashcards.map((card) => (
          <FlashcardItem
            key={card.id}
            card={card}
            onRemove={onRemoveFlashcard}
            onUpdate={onUpdateFlashcard}
            disableRemove={flashcards.length === 1}
          />
        ))}
        {/* Add Card Button as a Card-like Div */}
        <div
          className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer rounded-lg bg-white flex flex-col items-center justify-center py-8 text-gray-500 hover:text-gray-700 shadow-sm"
          onClick={onAddFlashcard}
        >
          <Plus className="h-8 w-8 mb-2" />
          <span className="text-lg font-medium">Add New Card</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6">
        {onCancel && (
          <Button variant="outline" className="border-gray-300" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
        )}
        <Button
          onClick={onSave}
          className="bg-gradient-to-r from-[#2980B9] via-[#6DD5FA] to-[#FFFFFF] text-white hover:from-[#2980B9] hover:to-[#6DD5FA] shadow-md px-8"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Flashcard Set"}
        </Button>
      </div>
    </div>
  )
}

export default FlashcardSetForm;