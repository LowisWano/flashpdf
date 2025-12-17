import Link from "next/link"
import { MoreVertical } from 'lucide-react'
import { DeckType, getDecks } from "@/services/deck.service"
import { createClient } from "@/utils/supabase/server"
import FlashcardsSection from "@/components/flashcards-section"
import {
  Card,
  CardTitle,
  CardContent
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (!data?.user?.id) {
    return <div>User not authenticated</div>
  }

  const decks = await getDecks(data.user.id)
  const currentDeck = decks.find(d => d.id === id) as DeckType

  if (!currentDeck) {
    return <div>Deck not found</div>
  }

  console.log("Current Deck:", currentDeck)

  return (
    <div className="flex justify-center flex-col sm:mx-45">
      <Card className="mb-6">
        <CardContent className="flex flex-row justify-between">
        <div className="flex items-center justify-center">
          <CardTitle className="text-xl">
            {currentDeck.title}
          </CardTitle>
          </div>

          <div className="items-center flex justify-center">
            <Link href={`./${id}/edit`}>
              <Button className="bg-gradient-to-r from-[#2980B9] via-[#6DD5FA] to-[#FFFFFF] hover:from-[#2980B9] hover:to-[#6DD5FA]">Edit Flashcards</Button>
            </Link>
            <button className="p-1 hover:bg-gray-100 rounded-full">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </CardContent>
      </Card>
      
      <FlashcardsSection flashcards={currentDeck.flashcards}/>
    </div>
  )
}