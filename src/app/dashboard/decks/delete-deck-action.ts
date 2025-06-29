'use server'

import { deleteDeck } from '@/services/deck.service'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function deleteDeckAction(deckId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) {
    throw new Error('Not authenticated')
  }
  await deleteDeck(deckId, data.user.id)
  revalidatePath('/dashboard')
} 