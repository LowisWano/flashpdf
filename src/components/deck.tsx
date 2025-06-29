import Link from 'next/link'
import { Download, Edit, MoreVertical, Play, Share2, Star, Trash2 } from 'lucide-react'
import { Deck as DeckType } from "@/services/deck.service"
import { useState, useTransition } from 'react'
import { deleteDeckAction } from '@/app/dashboard/decks/delete-deck-action'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog'

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

export default function Deck({ deck }: { 
  deck: DeckType
}) {
  const [showDelete, setShowDelete] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      await deleteDeckAction(deck.id)
      setShowDelete(false)
      // Optionally: trigger a refresh or callback
      window.location.reload()
    })
  }

  return (
      <Card key={deck.id} className="hover:shadow-lg transition-shadow group justify-between">
        <CardHeader className="">
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
                <DropdownMenuItem className="text-red-600" onClick={() => setShowDelete(true)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
        <Dialog open={showDelete} onOpenChange={setShowDelete}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Deck</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this deck? This action cannot be undone.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDelete(false)} disabled={isPending}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
                {isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
  )
}