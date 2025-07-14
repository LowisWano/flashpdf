import Link from "next/link"
import { Edit, Folder as FolderIcon, Plus, MoreVertical } from 'lucide-react'
import { getFolderById } from "@/services/folder.service"
import { createClient } from "@/utils/supabase/server"
import DecksSection from "@/components/decks-section"
import { CreateFlashcardsDialog } from "@/components/create-flashcards-dialog"
import { Deck } from "@/generated/prisma"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function FolderPage({
  params,
}: {
  params: { id: string }
}) {
  const {id} = await params
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (!data?.user?.id) {
    return <div>User not authenticated</div>
  }

  const folder = await getFolderById(id)

  if (!folder) {
    return <div>Folder not found</div>
  }

  if (folder.userId !== data.user.id) {
    return <div>Unauthorized</div>
  }
  
  // Get the decks from the folder
  const decks = folder.decks

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <FolderIcon className="h-6 w-6" style={{ color: folder.color || "#4F46E5" }} />
                <CardTitle>{folder.name}</CardTitle>
              </div>
              {folder.description && (
                <CardDescription className="mt-2">{folder.description}</CardDescription>
              )}
            </div>
            <div className="flex space-x-2">
              <CreateFlashcardsDialog folderId={id} />
              <Link href={`/dashboard/folders/${id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-500">
            {decks.length === 0 
              ? "No decks in this folder yet" 
              : `${decks.length} deck${decks.length === 1 ? '' : 's'} in this folder`
            }
          </div>
        </CardContent>
      </Card>

      <DecksSection decks={decks} />
    </div>
  )
}
