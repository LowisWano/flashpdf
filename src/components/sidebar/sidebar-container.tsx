import { createClient } from '@/utils/supabase/server'
import { getFolders } from '@/services/folder.service'
import { AppSidebar } from './app-sidebar'
import type { FolderWithDecks } from '@/lib/types'
import { getUserById } from '@/services/user.service'

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

  const { id, name } = await getUserById(data.user.id)

  const userDetails = {
    folders,
    credentials: {
      email: data.user.email || '', // Provide a default empty string
      name: data.user.user_metadata?.full_name || name || 'User',
      avatar: data.user.user_metadata?.avatar_url || '',
    }
  }

  return <AppSidebar userDetails={userDetails} />
}