import { Deck } from "@/generated/prisma";
import prisma from "@/lib/prisma"

export interface FlashcardEntry {
  term: string;
  definition: string;
}

export interface DeckEntry {
  title: string;
  description?: string;
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

export async function createDeck({ userId, deck }: {
  userId: string,
  deck: DeckEntry,
}): Promise<Deck> {
  const createdDeck = await prisma.deck.create({
    data: {
      title: deck.title,
      userId: userId,
      description: deck.description || "",
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