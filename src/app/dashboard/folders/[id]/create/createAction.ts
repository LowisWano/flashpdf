"use server"

import { createDeck } from "@/services/deck.service"
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from "next/navigation"
import { Flashcard } from "@/components/flashcard-item"
import { getFolderById } from "@/services/folder.service"

export async function createDeckInFolderAction({ title, description, topics, flashcards, folderId }: {
  title: string,
  description: string,
  topics: string[],
  flashcards: Flashcard[],
  folderId: string
}) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
      return { success: false, error: "Unauthorized" }
    }

    // Verify folder exists and belongs to the user
    const folder = await getFolderById(folderId)
    if (!folder) {
      return { success: false, error: "Folder not found" }
    }
    
    if (folder.userId !== data.user.id) {
      return { success: false, error: "Unauthorized" }
    }

    const deck = await createDeck({
      userId: data.user.id,
      deck: {
        title,
        description,
        topics,
        flashcards: flashcards.map(({ term, definition }) => ({ term, definition })),
        cardCount: flashcards.length,
      },
      folderId // Pass the folderId to the createDeck function
    });

    revalidatePath("/dashboard")
    revalidatePath(`/dashboard/folders/${folderId}`)
    
    // Redirect to the folder view after successful creation
    redirect(`/dashboard/folders/${folderId}`)
  } catch (error) {
    console.error("Error creating deck in folder:", error)
    return { success: false, error: "An error occurred while creating the deck" }
  }
}
