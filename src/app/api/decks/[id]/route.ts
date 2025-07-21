import { createClient } from '@/utils/supabase/server'
import { updateDeckProgress } from '@/services/deck.service'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    
    const body = await req.json()
    const { accuracy, progress } = body
    
    // Validate accuracy if provided
    if (accuracy !== undefined && (typeof accuracy !== 'number' || accuracy < 0 || accuracy > 100)) {
      return new NextResponse(JSON.stringify({ error: 'Invalid accuracy value' }), {
        status: 400,
      })
    }
    
    // Validate progress if provided
    if (progress !== undefined && (typeof progress !== 'number' || progress < 0 || progress > 100)) {
      return new NextResponse(JSON.stringify({ error: 'Invalid progress value' }), {
        status: 400,
      })
    }
    
    const updatedDeck = await updateDeckProgress({
      deckId: id,
      accuracy,
      progress: progress || 0,
    })
    
    return NextResponse.json({ success: true, deck: updatedDeck })
  } catch (error) {
    console.error('Error updating deck progress:', error)
    return new NextResponse(JSON.stringify({ error: 'Failed to update deck progress' }), {
      status: 500,
    })
  }
}
