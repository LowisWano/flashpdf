import { getDecks } from "@/services/deck.service"
import EditDeckForm from "./edit-deck-form"

export default async function Page({
  params,
}: {
  params: { id: string }
}) {
  // This is a server component that safely uses params
  const { id } = await params
  const decks = getDecks()
  const currentDeck = decks.find((d) => d.id === Number(id))
  
  if (!currentDeck) {
    return <div className="p-8 text-center text-lg">Deck not found</div>
  }
  
  return <EditDeckForm deckId={id} deck={currentDeck} />
}
