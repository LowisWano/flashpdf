"use client"

import { useState } from 'react'
import Link from 'next/link'
import {  Edit, FolderPlus, MoreVertical, Play, Star, Trash2 } from 'lucide-react'
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
import MoveDeckToFolderDialog from './folder/move-deck-to-folder-dialog'

export default function Deck({ deck, isSelectable, isSelected, onSelect }: { 
  deck: DeckType,
  isSelectable?: boolean,
  isSelected?: boolean,
  onSelect?: (deckId: string) => void
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  
  const handleRemoveFromFolder = async () => {
    if (!deck.folderId) return;
    
    setIsRemoving(true);
    try {
      const response = await fetch(`/api/decks/${deck.id}/remove-from-folder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove deck from folder');
      }
      
      // Refresh the page to show changes
      window.location.reload();
    } catch (error) {
      console.error('Error removing deck from folder:', error);
      alert('Failed to remove deck from folder. Please try again.');
    } finally {
      setIsRemoving(false);
    }
  }
  return (
      <Card 
        key={deck.id} 
        className={`hover:shadow-lg transition-shadow group justify-between ${isSelected ? 'ring-2 ring-primary' : ''}`}
        onClick={isSelectable && onSelect ? () => onSelect(deck.id) : undefined}
      >
        <CardHeader className={isSelectable ? 'cursor-pointer' : ''}>
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            {isSelectable && (
              <div className="absolute top-2 right-2">
                <div className={`w-5 h-5 rounded-full border ${isSelected ? 'bg-primary border-primary' : 'border-gray-300'} flex items-center justify-center`}>
                  {isSelected && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
              </div>
            )}
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
                  >
                    <MoreVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <Link href={`/dashboard/decks/${deck.id}/edit`} passHref>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem
                    onClick={deck.folderId ? () => handleRemoveFromFolder() : () => setIsMoveDialogOpen(true)}
                  >
                    <FolderPlus className="w-4 h-4 mr-2" />
                    {deck.folderId ? 'Remove from Folder' : 'Move to Folder'}
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
          
          {/* Move to folder dialog */}
          <MoveDeckToFolderDialog
            deckId={deck.id}
            deckTitle={deck.title}
            open={isMoveDialogOpen}
            onOpenChange={setIsMoveDialogOpen}
          />
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
          <div className='flex flex-col gap-2'>
            <Link href={`/dashboard/decks/${deck.id}/study`}>
              <Button className="w-full bg-gradient-to-r from-[#2980B9] via-[#6DD5FA] to-[#FFFFFF] hover:from-[#2980B9] hover:to-[#6DD5FA]">
                <Play className="w-4 h-4 mr-2" />
                Study Now
              </Button>
            </Link>
            <Link href={`/dashboard/decks/${deck.id}`}>
              <Button className="w-full" variant="outline">
                View Deck
              </Button>
            </Link>
          </div>
          
        </CardContent>
      </Card>
  )
}