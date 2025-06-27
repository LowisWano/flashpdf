'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'

export async function editDeck(deckId: string, data: { title: string; description: string; flashcards: { id: string; term: string; definition: string; }[] }) {
  // Update ni sa deck title og description
  await prisma.deck.update({
    where: { id: deckId },
    data: {
      title: data.title,
      description: data.description,
    },
  })

  // mo fetch og existing flashcards for the deck
  const existingFlashcards = await prisma.flashcard.findMany({
    where: { deckId },
  })

  // Update or delete existing flashcards
  for (const card of existingFlashcards) {
    const updated = data.flashcards.find((f) => f.id === card.id)
    if (updated) {
      // Update term og definition
      await prisma.flashcard.update({
        where: { id: card.id },
        data: {
          term: updated.term,
          definition: updated.definition,
        },
      })
    } else {
      // Remove flashcard if not present in new list
      await prisma.flashcard.delete({ where: { id: card.id } })
    }
  }

  // Add new flashcards (those with ids not in existing)
  const existingIds = existingFlashcards.map((c) => c.id)
  for (const card of data.flashcards) {
    if (!existingIds.includes(card.id)) {
      await prisma.flashcard.create({
        data: {
          id: card.id,
          term: card.term,
          definition: card.definition,
          deckId,
        },
      })
    }
  }

  // Optionally revalidate or redirect
  revalidatePath(`/dashboard/decks/${deckId}`)
}