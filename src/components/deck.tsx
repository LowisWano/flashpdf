import Link from 'next/link'
import { MoreVertical, Pin } from 'lucide-react'
import { Deck as DeckType } from "@/services/deck.service"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

export default function Deck({ deck }: { 
  deck: DeckType
}) {
  return (
    <Link href={`/decks/${deck.id}`} className="block w-full">
      <Card className="hover:ring-4 hover:ring-orange-300 transition-all relative w-full">
        <CardHeader>
          <CardTitle className="truncate">{deck.title}</CardTitle>
          <p>
            Last opened: {new Date(deck.lastOpened).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric"
            })}</p>
        </CardHeader>
        <CardContent>
          <Badge className='bg-orange-400 p-2'>Flashcards ({deck.flashcards.length})</Badge>
        </CardContent>
        <div className="flex justify-end gap-1 p-3">
          <button className="p-1 hover:bg-gray-100 rounded-full">
            <Pin className="h-5 w-5" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded-full">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </Card>
    </Link>
  )
}