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

export async function deleteDeck(deckId: string, userId: string): Promise<void> {
  // Verify the deck belongs to the user before deleting
  const deck = await prisma.deck.findFirst({
    where: {
      id: deckId,
      userId: userId,
    },
  })

  if (!deck) {
    throw new Error("Deck not found or you don't have permission to delete it")
  }

  // Delete the deck (flashcards will be deleted automatically due to CASCADE)
  await prisma.deck.delete({
    where: {
      id: deckId,
    },
  })
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