import { createClient } from '@/utils/supabase/server'
import { DeckType, getDeckById } from '@/services/deck.service'
import StudySession from '@/components/study-session'

export default async function StudyPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  
  if (!data?.user?.id) {
    return <div>User not authenticated</div>
  }
  
  const { id } = await params
  if (!id) {
    return <div>Deck ID is required</div>
  }
  const deck = await getDeckById(id) as DeckType
  
  if (!deck) {
    return <div>Deck not found</div>
  }
  
  if (deck.userId !== data.user.id) {
    return <div>Unauthorized</div>
  }

  return (
    <div className="flex justify-center flex-col sm:mx-45">
      <StudySession deck={deck} />
    </div>
  )
}
