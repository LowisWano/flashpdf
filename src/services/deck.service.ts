import { Deck, Flashcard } from "@/generated/prisma"
import prisma from "@/lib/prisma"
import { Prisma } from "@/generated/prisma"


export async function getDecks(userId: string): Deck[] {
  const decks: Deck[] = await prisma.deck.findMany({
    where: {
      userId: userId,
    },
    include: {
      flashcards: true
    }
  })

  return decks
}

// implement database query for add flashcard here.
export function addFlashcard(flashcards: Flashcard[]): Flashcard[] {
  const newCard: Flashcard = {
    id: "1",
    term: "add",
    definition: "definition",
    deckId: "1"
  }
  return [...flashcards, newCard]
}

// implement database query for remove flashcard here.
export function removeFlashcard(flashcards: Flashcard[], id: string): Flashcard[] {
  if (flashcards.length > 1) {
    return flashcards.filter((card) => card.id !== id)
  }
  return flashcards
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