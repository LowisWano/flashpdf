import { getDecks } from "@/services/deck.service"
import EditDeckForm from "./edit-deck-form"
import { createClient } from '@/utils/supabase/server'

export default async function Page( { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) {
    return <div className="p-8 text-center text-lg">User not found</div>
  }
  const decks = await getDecks(data.user.id)
  const currentDeck = decks.find((d) => d.id === id)
  
  if (!currentDeck) {
    return <div className="p-8 text-center text-lg">Deck not found</div>
  }
  
  return <EditDeckForm deckId={id} deck={currentDeck} />
}
