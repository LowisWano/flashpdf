import { NextRequest, NextResponse } from 'next/server';
import { moveDeckToFolder } from '@/services/deck.service';
import { createClient } from '@/utils/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // folderId
    const { deckIds } = await request.json();
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Move each deck to the folder
    const results = await Promise.all(
      deckIds.map((deckId: string) => 
        moveDeckToFolder({ deckId, folderId: id })
      )
    );

    return NextResponse.json({
      message: `${results.length} decks added to folder successfully`,
      decks: results
    });
  } catch (error) {
    console.error('Error adding decks to folder:', error);
    return NextResponse.json(
      { message: 'Failed to add decks to folder' },
      { status: 500 }
    );
  }
}
