import DecksSection from "@/components/decks-section"
import { getDecks } from "@/services/deck.service"
import { Deck } from "@/generated/prisma"
import { createClient } from '@/utils/supabase/server'
import { FolderOpen, Plus, Sparkles } from "lucide-react"
import Link from "next/link"

export default async function Dashboard() {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    return <div>an error occured</div>
  }

  const decks: Deck[] = await getDecks(data.user.id)
  
  return (
    <div>
      <h1 className="scroll-m-20 font-bold text-2xl tracking-tighter md:text-4xl relative mb-4 flex items-center gap-4">My Flashcard Sets</h1>
      
      {decks.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-white shadow-sm">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 mb-4">
            <FolderOpen className="h-6 w-6 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2">You have no flashcard sets yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">
            Create your first deck to start learning more effectively.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/dashboard/create" 
              className="inline-flex items-center px-4 py-2 rounded-md bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold shadow-sm transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Deck
            </Link>
            <Link 
              href="/dashboard/upload" 
              className="inline-flex items-center px-4 py-2 rounded-md bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold shadow-sm transition-colors duration-200"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate with AI
            </Link>
          </div>
        </div>
      ) : (
        <DecksSection decks={decks} />
      )}
    </div>
  )
}