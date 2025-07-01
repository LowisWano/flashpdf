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

export async function deleteDeck({
  userId,
  deckId
}: {
  userId: string,
  deckId: string
}){
  try {
    const deck = await prisma.deck.findUnique({
      where: { id: deckId },
      select: { userId: true }
    })

    if (!deck || deck.userId !== userId) {
      return false
    }

    await prisma.flashcard.deleteMany({
      where: { deckId }
    })

    await prisma.deck.delete({
      where: { id: deckId }
    })

    return true
  } catch (error) {
    console.error('Error deleting deck:', error)
    return false
  }
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