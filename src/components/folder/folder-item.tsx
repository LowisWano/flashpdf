"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Edit, FolderOpen, MoreVertical, Share2 } from 'lucide-react'
import { FolderWithDecks } from '@/lib/types'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import DeleteFolderDialog from '../delete-folder-dialog'
import EditFolderDialog from './edit-folder-dialog'

export default function FolderItem({ folder }: { 
  folder: FolderWithDecks
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const deckCount = folder.decks ? folder.decks.length : 0
  
  return (
    <Card className="border-2 hover:border-gray-300 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div 
            className="w-12 h-12 rounded-md flex items-center justify-center mb-2"
            style={{backgroundColor: folder.color || '#4F46E5'}}
          >
            <FolderOpen className="h-6 w-6 text-white" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:bg-gray-100 rounded-full">
                <MoreVertical className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={(e) => {
                e.preventDefault();
                setIsEditDialogOpen(true);
              }}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                <span>Share</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteFolderDialog
                folderId={folder.id}
                folderName={folder.name}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardTitle>{folder.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {folder.description || 'No description'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <Badge 
              variant="secondary" 
              className={`${
                deckCount > 0 
                  ? 'bg-purple-800 text-white hover:bg-purple-900' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {deckCount} {deckCount === 1 ? 'deck' : 'decks'}
            </Badge>
            
            {deckCount > 0 && (
              <span className="ml-2 text-xs text-gray-500">
                {folder.decks?.reduce((total, deck) => total + (deck.cardCount || 0), 0)} cards
              </span>
            )}
          </div>
          <Link href={`/dashboard/folders/${folder.id}`}>
            <Button size="sm" className="bg-gradient-to-r from-[#2980B9] via-[#6DD5FA] to-[#FFFFFF] hover:from-[#2980B9] hover:to-[#6DD5FA]">
              Open
            </Button>
          </Link>
        </div>
      </CardContent>
      
      {/* Edit Folder Dialog */}
      <EditFolderDialog 
        folder={folder}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </Card>
  )
}
