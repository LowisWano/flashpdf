import { FolderOpen } from 'lucide-react'
import { getFolderById } from "@/services/folder.service"
import { createClient } from "@/utils/supabase/server"
import DecksSection from "@/components/decks-section"
import {
  Card,
  CardTitle,
  CardContent
} from "@/components/ui/card"
import FolderOptions from "./folder-options"
import AddDeckToFolderButton from "./add-deck-to-folder-button"
import EmptyFolderActions from "./empty-folder-actions"

export default async function FolderPage({
  params,
}: {
  params: Promise<{ id: string }>
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
    <div className="flex justify-center flex-col">
      <Card className="mb-7">
        <CardContent className="flex flex-row justify-between">
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
            <AddDeckToFolderButton folderId={folder.id} />
            <FolderOptions folder={folder} />
          </div>
        </CardContent>
      </Card>
      {folder.decks && folder.decks.length > 0 ? (
        <DecksSection decks={folder.decks} currentFolderId={folder.id}/>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-white">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 mb-4">
            <FolderOpen className="h-6 w-6 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2">This folder is empty</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">
            Add some decks to this folder to get started.
          </p>
          <EmptyFolderActions folderId={folder.id} />
        </div>
      )}
    </div>
  )
}
