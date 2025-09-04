import FoldersSection from "@/components/folder/folders-section"
import { getFolders } from "@/services/folder.service"
import { FolderWithDecks } from "@/lib/types"
import { createClient } from '@/utils/supabase/server'
import { Suspense } from "react"

// Loading component for the Suspense fallback
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading folders...</p>
      </div>
    </div>
  )
}

// Component that fetches and displays folders
async function FoldersContent() {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    return <div>An error occurred</div>
  }

  if (!data?.user?.id) {
    return <div>User not authenticated</div>
  }

  const folders: FolderWithDecks[] = await getFolders(data.user.id)
  
  return <FoldersSection folders={folders}/>
}

export default function FoldersPage() {
  return (
    <div>
      <h1 className="scroll-m-20 font-bold text-2xl tracking-tighter md:text-4xl relative mb-4 flex items-center gap-4">My Folders</h1>
      
      <Suspense fallback={<LoadingSpinner />}>
        <FoldersContent />
      </Suspense>
    </div>
  )
}
