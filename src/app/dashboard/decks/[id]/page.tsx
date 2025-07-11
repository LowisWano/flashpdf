import Link from "next/link"
import { MoreVertical } from 'lucide-react'
import { getDecks } from "@/services/deck.service"
import { createClient } from "@/utils/supabase/server"
import FlashcardsSection from "@/components/flashcards-section"
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function Page({
  params,
}: {
  params: { id: string }
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (!data?.user?.id) {
    return <div>User not authenticated</div>
  }

  const decks = await getDecks(data.user.id)
  const currentDeck = decks.find(d => d.id === id)

  if (!currentDeck) {
    return <div>Deck not found</div>
  }

  return (
    <div className="flex justify-center flex-col sm:mx-45">
      <Card className="mb-6">
        <CardHeader className="flex flex-row justify-between">
          <CardTitle className="text-2xl">
            {currentDeck.title}
          </CardTitle>

          <div className="items-center flex justify-center">
            <Link href={`./${id}/edit`}>
              <Button className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700">Edit Flashcards</Button>
            </Link>
            <button className="p-1 hover:bg-gray-100 rounded-full">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </CardHeader>
      </Card>
      
      <FlashcardsSection flashcards={currentDeck.flashcards}/>
    </div>
  )
}