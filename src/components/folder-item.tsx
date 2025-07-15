"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Edit, FolderOpen, MoreVertical, Share2, Trash2 } from 'lucide-react'
import { FolderWithDecks } from '@/lib/types'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Badge } from './ui/badge'

export default function FolderItem({ folder }: { 
  folder: FolderWithDecks
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  
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
              <Link href={`/dashboard/folders/${folder.id}/edit`}>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                <span>Share</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
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
          <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
            {deckCount} {deckCount === 1 ? 'deck' : 'decks'}
          </Badge>
          <Link href={`/dashboard/folders/${folder.id}`}>
            <Button size="sm" className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700">
              Open
            </Button>
          </Link>
        </div>
      </CardContent>
      
      {/* TODO: Add delete confirmation dialog once it's created */}
    </Card>
  )
}
