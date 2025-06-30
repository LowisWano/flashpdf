import { Deck, Flashcard } from "@/generated/prisma"
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
  deck: DeckEntry
}): Promise<Deck> {
  const createdDeck = await prisma.deck.create({
    data: {
      title: deck.title,
      userId: userId,
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