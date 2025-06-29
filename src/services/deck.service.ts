import prisma from "@/lib/prisma"
import { Prisma } from "@/generated/prisma"

export async function getDecks(userId: string): Promise<DeckWithFlashcards[]> {
  const decks = await prisma.deck.findMany({
    where: {
      userId: userId,
    },
    include: {
      flashcards: true
    }
  })

  return decks
}

// Prisma helper type that includes nested flashcards
export type DeckWithFlashcards = Prisma.DeckGetPayload<{
  include: {
    flashcards: true
  }
}>

// Create a new deck together with its flashcards for a user
export async function createDeck(
  userId: string,
  data: {
    title: string
    description: string
    topics?: string[]
    flashcards: { term: string; definition: string }[]
  }
): Promise<DeckWithFlashcards> {
  const {
    title,
    description,
    topics = [],
    flashcards: flashcardsInput,
  } = data

  const deck = await prisma.deck.create({
    data: {
      title,
      description,
      topics,
      studyProgress: 0,
      cardCount: flashcardsInput.length,
      accuracy: 0,
      lastStudied: new Date(),
      isStarred: false,
      userId,
      flashcards: {
        createMany: {
          data: flashcardsInput.map((fc) => ({
            term: fc.term,
            definition: fc.definition,
          })),
        },
      },
    },
    include: {
      flashcards: true,
    },
  })

  return deck
}

// Delete a deck if it belongs to the given user – returns true if deleted
export async function deleteDeck(userId: string, deckId: string): Promise<boolean> {
  // Verify ownership
  const deck = await prisma.deck.findUnique({
    where: { id: deckId },
    select: { userId: true },
  })

  if (!deck || deck.userId !== userId) return false

  await prisma.deck.delete({ where: { id: deckId } })
  return true
}

export interface DraftFlashcard {
  id: string
  term: string
  definition: string
}

export function addFlashcard(flashcards: DraftFlashcard[]): DraftFlashcard[] {
  const newCard: DraftFlashcard = {
    id: crypto.randomUUID(),
    term: "",
    definition: "",
  }
  return [...flashcards, newCard]
}

export function removeFlashcard(flashcards: DraftFlashcard[], id: string): DraftFlashcard[] {
  if (flashcards.length > 1) {
    return flashcards.filter((card) => card.id !== id)
  }
  return flashcards
}

export function updateFlashcard(
  flashcards: DraftFlashcard[], 
  id: string, 
  field: "term" | "definition", 
  value: string
): DraftFlashcard[] {
  return flashcards.map((card) => 
    card.id === id ? { ...card, [field]: value } : card
  )
}