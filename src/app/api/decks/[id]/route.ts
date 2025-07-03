import { createClient } from '@/utils/supabase/server'
import { updateDeckProgress } from '@/services/deck.service'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    const {id} = await params
    
    if (!userData?.user?.id) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      })
    }
    
    const { accuracy } = await req.json()
    
    if (typeof accuracy !== 'number' || accuracy < 0 || accuracy > 100) {
      return new NextResponse(JSON.stringify({ error: 'Invalid accuracy value' }), {
        status: 400,
      })
    }
    
    const updatedDeck = await updateDeckProgress({
      deckId: id,
      accuracy,
    })
    
    return NextResponse.json({ success: true, deck: updatedDeck })
  } catch (error) {
    console.error('Error updating deck progress:', error)
    return new NextResponse(JSON.stringify({ error: 'Failed to update deck progress' }), {
      status: 500,
    })
  }
}
