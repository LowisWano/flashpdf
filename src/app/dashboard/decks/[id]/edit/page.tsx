import { getDecks, DeckWithFlashcards } from "@/services/deck.service"
import EditDeckForm from "./edit-deck-form"
import { createClient } from '@/utils/supabase/server'

export default async function Page({
  params,
}: {
  params: { id: string }
}) {
  // This is a server component that safely uses params
  const { id } = params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <div className="p-8 text-center text-lg">Unauthenticated</div>
  }

  const decks: DeckWithFlashcards[] = await getDecks(user.id)

  const currentDeck = decks.find((d) => d.id === id)
  
  if (!currentDeck) {
    return <div className="p-8 text-center text-lg">Deck not found</div>
  }
  
  return <EditDeckForm deckId={id} deck={currentDeck} />
}
