import { createClient } from '@/utils/supabase/server'
import { getFolders } from '@/services/folder.service'
import { AppSidebar } from './app-sidebar'
import type { FolderWithDecks } from '@/lib/types'

export async function SidebarContainer() {
  const supabase = await createClient()
    
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    return <div>An error occurred</div>
  }

  if (!data?.user?.id) {
    return <div>User not authenticated</div>
  }
  
  const folders: FolderWithDecks[] = await getFolders(data.user.id)
  console.log(data.user)
  return <AppSidebar userFolders={folders} />
}