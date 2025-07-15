import Link from "next/link"
import { MoreVertical, FolderOpen, Edit, Share2, Trash2 } from 'lucide-react'
import { FolderWithDecks } from "@/lib/types"
import { getFolderById } from "@/services/folder.service"
import { createClient } from "@/utils/supabase/server"
import DecksSection from "@/components/decks-section"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DeleteFolderDialog from "@/components/delete-folder-dialog"
import FolderEditButton from "./folder-edit-button"
import DeleteFolderButton from "./delete-folder-button"
import BackButton from "./back-button"

export default async function FolderPage({
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

  const folder = await getFolderById(id)

  if (!folder) {
    return <div>Folder not found</div>
  }

  return (
    <div className="flex justify-center flex-col sm:mx-45">
      <Card className="mb-6">
        <CardContent className="flex flex-row justify-between py-6">
          <div className="flex items-center">
            <div 
              className="w-10 h-10 rounded-md flex items-center justify-center mr-4"
              style={{backgroundColor: folder.color || '#4F46E5'}}
            >
              <FolderOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">
                {folder.name}
              </CardTitle>
              {folder.description && (
                <p className="text-gray-500 text-sm mt-1">{folder.description}</p>
              )}
            </div>
          </div>

          <div className="items-center flex justify-center space-x-2">
            <FolderEditButton folder={folder} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 hover:bg-gray-100 rounded-full">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
        </CardContent>
      </Card>
      
      <div className="flex gap-4 mb-6">
        <DeleteFolderButton folderId={folder.id} folderName={folder.name} />
        <BackButton />
      </div>
      
      {folder.decks && folder.decks.length > 0 ? (
        <DecksSection decks={folder.decks}/>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-white">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 mb-4">
            <FolderOpen className="h-6 w-6 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2">This folder is empty</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">
            Add some decks to this folder to get started.
          </p>
          <Link href="/dashboard/create">
            <Button className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700">
              Create New Deck
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
