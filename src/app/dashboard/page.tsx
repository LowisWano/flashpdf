
import DecksSection from "@/components/decks-section"
import { getDecks, Deck } from "@/services/deck.service"

export default function Dashboard() {

  const decks: Deck[] = getDecks()
  
  return (
    <div >
      <DecksSection decks={decks}/>
    </div>
  )
}