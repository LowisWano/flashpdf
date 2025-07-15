
import DecksSection from "@/components/decks-section"
import { getDecks } from "@/services/deck.service"
import { Deck } from "@/generated/prisma"
import { createClient } from '@/utils/supabase/server'

export default async function Dashboard() {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    return <div>an error occured</div>
  }

  const decks: Deck[] = await getDecks(data.user.id)
  
  return (
    <div>
      <DecksSection decks={decks} />
    </div>
  )
}