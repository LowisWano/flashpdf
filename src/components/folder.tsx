"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Folder as FolderIcon, MoreVertical, Trash2 } from 'lucide-react'
import { Folder as FolderType } from '@/generated/prisma'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Dialog } from './ui/dialog'
import DeleteFolderDialog from './delete-folder-dialog'

export default function Folder({ folder }: { 
  folder: FolderType
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const folderColor = folder.color || "#4F46E5"
  
  return (
    <Card className="hover:shadow-lg transition-shadow group justify-between">
      <CardHeader>
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <FolderIcon className="w-5 h-5" style={{ color: folderColor }} />
                <CardTitle className="text-lg line-clamp-1">{folder.name}</CardTitle>
              </div>
              <CardDescription className="line-clamp-2">{folder.description}</CardDescription>
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
                <Link href={`/dashboard/folders/${folder.id}/edit`} passHref>
                  <DropdownMenuItem>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                </Link>
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
          <DeleteFolderDialog 
            folderId={folder.id} 
            folderName={folder.name} 
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          />
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Decks</span>
          <span className="font-medium">{folder.decks.length}</span>
        </div>

        <div className='flex flex-col gap-2'>
          <Link href={`/dashboard/folders/${folder.id}`}>
            <Button className="w-full bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700">
              <FolderIcon className="w-4 h-4 mr-2" />
              Open Folder
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
