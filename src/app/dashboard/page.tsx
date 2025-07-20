
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
      <h1 className="scroll-m-20 font-bold text-2xl tracking-tighter md:text-4xl relative mb-4 flex items-center gap-4">My Flashcard Sets</h1>
      <DecksSection decks={decks} />
    </div>
  )
}