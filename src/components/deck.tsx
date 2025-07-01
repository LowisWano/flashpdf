"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Download, Edit, MoreVertical, Play, Share2, Star, Trash2 } from 'lucide-react'
import { Deck as DeckType } from '@/generated/prisma'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Badge } from "@/components/ui/badge"
import { Progress } from './ui/progress'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Dialog } from './ui/dialog'
import DeleteDeckDialog from './delete-deck-dialog'

export default function Deck({ deck }: { 
  deck: DeckType
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  return (
      <Card key={deck.id} className="hover:shadow-lg transition-shadow group justify-between">
        <CardHeader className="">
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <CardTitle className="text-lg line-clamp-1">{deck.title}</CardTitle>
                  {deck.isStarred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                </div>
                <CardDescription className="line-clamp-2">{deck.description}</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <Link href={`/dashboard/decks/${deck.id}/edit`} passHref>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <div className="flex">
                      <Trash2 className="w-4 h-4 mr-4" />
                      Delete
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <DeleteDeckDialog deckId={deck.id} deckTitle={deck.title} setIsDeleteDialogOpen={setIsDeleteDialogOpen}/>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-1">
            {deck.topics.slice(0, 2).map((topic) => (
              <Badge key={topic} variant="secondary" className="text-xs">
                {topic}
              </Badge>
            ))}
            {deck.topics.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{deck.topics.length - 2}
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{deck.studyProgress}%</span>
            </div>
            <Progress value={deck.studyProgress} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Cards</div>
              <div className="font-semibold">{deck.cardCount}</div>
            </div>
            <div>
              <div className="text-gray-600">Accuracy</div>
              <div className="font-semibold">{deck.accuracy}%</div>
            </div>
          </div>
          
          <Link href={`/dashboard/decks/${deck.id}`}>
            <Button className="w-full bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700">
              <Play className="w-4 h-4 mr-2" />
              Study Now
            </Button>
          </Link>
        </CardContent>
      </Card>
  )
}