import { Deck, Flashcard } from "@/generated/prisma";
import prisma from "@/lib/prisma"
import { Prisma } from "@/generated/prisma"

interface FlashcardEntry {
  term: string;
  definition: string;
}

interface DeckEntry {
  title: string;
  flashcards: FlashcardEntry[];
  cardCount: number;
}
interface FlashcardEntry {
  term: string;
  definition: string;
}

interface DeckEntry {
  title: string;
  flashcards: FlashcardEntry[];
  cardCount: number;
}

export async function getDecks(userId: string): Promise<Deck[]> {
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

  return createdDeck;
}