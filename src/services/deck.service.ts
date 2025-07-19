import { Deck } from "@/generated/prisma";
import prisma from "@/lib/prisma"

export interface FlashcardEntry {
  id: string;
  term: string;
  definition: string;
}

export interface DeckEntry {
  id: string;
  title: string;
  description?: string;
  topics?: string[];
  flashcards: FlashcardEntry[];
  cardCount: number;
}

export async function getDecks(userId: string): Promise<Deck[]> {
  const decks = await prisma.deck.findMany({
    where: {
      userId: userId,
    },
    include: {
      flashcards: true
    }
  })

  // Update the cardCount on each deck to match the actual number of flashcards
  for (const deck of decks) {
    const flashcardsCount = deck.flashcards?.length || 0
    if (deck.cardCount !== flashcardsCount) {
      await prisma.deck.update({
        where: { id: deck.id },
        data: { cardCount: flashcardsCount }
      })
      deck.cardCount = flashcardsCount
    }
  }

  return decks
}

export async function getDeckById(deckId: string): Promise<Deck | null> {
  const deck = await prisma.deck.findUnique({
    where: {
      id: deckId,
    },
    include: {
      flashcards: true
    }
  });
  
  // Update the cardCount if it's not matching the actual number of flashcards
  if (deck && deck.flashcards) {
    const flashcardsCount = deck.flashcards.length
    if (deck.cardCount !== flashcardsCount) {
      await prisma.deck.update({
        where: { id: deckId },
        data: { cardCount: flashcardsCount }
      })
      deck.cardCount = flashcardsCount
    }
  }
  
  return deck;
}

export async function createDeck({ userId, deck }: {
  userId: string,
  deck: DeckEntry,
}): Promise<Deck> {
  const createdDeck = await prisma.deck.create({
    data: {
      title: deck.title,
      userId: userId,
      description: deck.description || "",
      topics: deck.topics || [],
      cardCount: deck.flashcards.length,
      flashcards: {
        create: deck.flashcards.map(f => ({
          term: f.term,
          definition: f.definition,
        })),
      },
    },
    include: {
      flashcards: true,
    },
  });

  return createdDeck;
}

export async function updateDeckProgress({
  deckId,
  accuracy,
  progress
}: {
  deckId: string;
  accuracy?: number;
  progress: number;
}): Promise<Deck> {
  const payload: {
    lastStudied: Date,
    studyProgress: number,
    accuracy?: number,
  } = {
    lastStudied: new Date(),
    studyProgress: progress
  }

  if (accuracy !== undefined) {
    payload.accuracy = accuracy;
    payload.studyProgress = 100;
  }

  const updatedDeck = await prisma.deck.update({
    where: {
      id: deckId
    },
    data: payload
  });
  
  return updatedDeck;
}

export async function deleteDeck({
  deckId
}: {
  deckId: string
}){
  try {
    const deck = await prisma.deck.delete({
      where: { id: deckId }
    })

    return deck
  } catch (error) {
    console.error('Error deleting deck:', error)
  }
}