import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import React from "react"

export interface Flashcard {
  id: string
  term: string
  definition: string
}

interface FlashcardItemProps {
  card: Flashcard
  onRemove: (id: string) => void
  onUpdate: (id: string, field: "term" | "definition", value: string) => void
  disableRemove?: boolean
}

const FlashcardItem: React.FC<FlashcardItemProps> = ({ card, onRemove, onUpdate, disableRemove }) => {
  return (
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex items-end mb-4">
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(card.id)}
          disabled={disableRemove}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-auto"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`term-${card.id}`} className="text-base">Answer</Label>
          <Input
            id={`term-${card.id}`}
            placeholder="Enter term"
            value={card.term}
            onChange={(e) => onUpdate(card.id, "term", e.target.value)}
            className="bg-white border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`definition-${card.id}`} className="text-base">Question</Label>
          <Input
            id={`definition-${card.id}`}
            placeholder="Enter definition"
            value={card.definition}
            onChange={(e) => onUpdate(card.id, "definition", e.target.value)}
            className="bg-white border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
          />
        </div>
      </div>
    </div>
  )
}

export default FlashcardItem; 