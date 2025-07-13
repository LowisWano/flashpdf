import { createClient } from '@/utils/supabase/server'
import { addDeckToFolder, removeDeckFromFolder } from '@/services/folder.service'
import { NextRequest, NextResponse } from 'next/server'

// POST to add a deck to a folder
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    const folderId = params.id
    
    if (!userData?.user?.id) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      })
    }
    
    const { deckId } = await request.json()
    
    if (!deckId) {
      return new NextResponse(JSON.stringify({ error: 'Deck ID is required' }), {
        status: 400,
      })
    }
    
    const success = await addDeckToFolder({
      deckId,
      folderId
    })
    
    if (!success) {
      return new NextResponse(JSON.stringify({ error: 'Failed to add deck to folder' }), {
        status: 500,
      })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error adding deck to folder:', error)
    return new NextResponse(JSON.stringify({ error: 'Failed to add deck to folder' }), {
      status: 500,
    })
  }
}

// DELETE to remove a deck from a folder
export async function DELETE(
  request: NextRequest,
) {
  try {
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    
    if (!userData?.user?.id) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      })
    }
    
    const url = new URL(request.url)
    const deckId = url.searchParams.get('deckId')
    
    if (!deckId) {
      return new NextResponse(JSON.stringify({ error: 'Deck ID is required' }), {
        status: 400,
      })
    }
    
    const success = await removeDeckFromFolder(deckId)
    
    if (!success) {
      return new NextResponse(JSON.stringify({ error: 'Failed to remove deck from folder' }), {
        status: 500,
      })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing deck from folder:', error)
    return new NextResponse(JSON.stringify({ error: 'Failed to remove deck from folder' }), {
      status: 500,
    })
  }
}
