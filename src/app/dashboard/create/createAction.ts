"use server"

import { createDeck } from "@/services/deck.service"
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { Flashcard } from "@/components/flashcard-item"
import { redirect } from "next/navigation"

export async function createDeckAction({ title, description, topics, flashcards, folderId }: {
  title: string,
  description: string,
  topics: string[],
  flashcards: Flashcard[],
  folderId?: string | null
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error) {
    throw Error("Error saving data")
  }

  await createDeck({
    userId: data.user.id,
    deck: {
      title,
      description,
      topics,
      flashcards: flashcards.map(({term, definition }) => ({term, definition })),
      cardCount: flashcards.length,
      folderId: folderId || undefined,
    }
  });

  revalidatePath("/dashboard")
  
  // If a folder ID was provided, redirect back to that folder
  if (folderId) {
    redirect(`/dashboard/folders/${folderId}`)
  } else {
    redirect("/dashboard")
  }
}