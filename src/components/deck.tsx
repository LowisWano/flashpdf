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
      <Card key={deck.id} className="hover:shadow-lg transition-shadow group flex flex-col">
        <CardHeader className="flex-grow">
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <CardTitle className="text-base md:text-lg line-clamp-1">{deck.title}</CardTitle>
                  {deck.isStarred && <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />}
                </div>
                <CardDescription className="line-clamp-2 text-xs md:text-sm">{deck.description}</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-1 h-8 w-8"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
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
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <DeleteDeckDialog 
              deckId={deck.id} 
              deckTitle={deck.title} 
              setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            />
          </Dialog>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center justify-between text-xs md:text-sm text-gray-600">
              <span>{deck.cardCount || 0} cards</span>
              <span className="truncate ml-2">
                {deck.lastStudied && new Date(deck.lastStudied).toLocaleDateString()}
              </span>
            </div>
            <Progress value={deck.studyProgress} className="h-1.5 md:h-2" />
            <div className="flex gap-2">
              <Link href={`/dashboard/decks/${deck.id}/study`} className="flex-1">
                <Button 
                  className="w-full bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-xs md:text-sm py-2 md:py-3"
                  size="sm"
                >
                  <Play className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Study
                </Button>
              </Link>
              <Link href={`/dashboard/decks/${deck.id}`}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs md:text-sm py-2 md:py-3 px-3 md:px-4"
                >
                  View
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
  )
}