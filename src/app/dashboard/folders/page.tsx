import FoldersSection from "@/components/folders-section"
import { getFolders } from "@/services/folder.service"
import { FolderWithDecks } from "@/lib/types"
import { createClient } from '@/utils/supabase/server'

export default async function FoldersPage() {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    return <div>An error occurred</div>
  }

  if (!data?.user?.id) {
    return <div>User not authenticated</div>
  }

  const folders: FolderWithDecks[] = await getFolders(data.user.id)
  
  return (
    <div>
      <FoldersSection folders={folders}/>
    </div>
  )
}
