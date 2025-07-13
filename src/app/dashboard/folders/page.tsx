import { createClient } from '@/utils/supabase/server'
import { getFolders } from "@/services/folder.service"
import FoldersSection from "@/components/folders-section"
import { Folder } from "@/generated/prisma"

export default async function FoldersPage() {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    return <div>An error occurred</div>
  }

  const folders: Folder[] = await getFolders(data.user.id)
  
  return (
    <div>
      <FoldersSection folders={folders}/>
    </div>
  )
}
