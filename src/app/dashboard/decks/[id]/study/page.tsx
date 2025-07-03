import Link from "next/link"
import { MoreVertical } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { getDeckById } from '@/services/deck.service'
import StudySession from '@/components/study-session'
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function StudyPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  
  if (!data?.user?.id) {
    return <div>User not authenticated</div>
  }
  
  // Get deck with all flashcards
  const { id } = await params
  if (!id) {
    return <div>Deck ID is required</div>
  }
  const deck = await getDeckById(id)
  
  if (!deck) {
    return <div>Deck not found</div>
  }
  
  // Check if user owns this deck
  if (deck.userId !== data.user.id) {
    return <div>Unauthorized</div>
  }

  return (
    <div className="flex justify-center flex-col mx-45">
      <Card className="mb-6">
        <CardHeader className="flex flex-row justify-between">
          <CardTitle className="text-2xl">
            {deck.title}
          </CardTitle>

          <div className="items-center flex justify-center">
            <Link href={`/dashboard/decks/${id}/edit`}>
              <Button className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700">Edit Deck</Button>
            </Link>
            <button className="p-1 hover:bg-gray-100 rounded-full">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </CardHeader>
      </Card>
      
      <StudySession deck={deck} userId={data.user.id} />
    </div>
  )
}
