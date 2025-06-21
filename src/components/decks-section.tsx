import Deck from "./deck"
import { Deck as DeckType } from "@/services/deck.service"

export default function DecksSection({
  decks,
}: {
  decks: DeckType[];
}) {
  return (
    <div>
      <h1 className="font-bold text-muted-foreground">Your decks</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-3">
        {
          decks.map((deck) => (
            <Deck key={deck.id} deck={deck} />
          ))
        }
      </div>
    </div>
  )
}