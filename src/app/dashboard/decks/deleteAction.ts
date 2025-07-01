'use server'

import { deleteDeck } from "@/services/deck.service"
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteDeckAction(deckId: string) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    const success = await deleteDeck({
      deckId
    })
    
    if (success) {
      revalidatePath('/dashboard')
      return { success: true }
    } else {
      return { success: false, error: 'Failed to delete deck' }
    }
  } catch (error) {
    console.error('Error in deleteDeckAction:', error)
    return { success: false, error: 'An error occurred while deleting the deck' }
  }
} 