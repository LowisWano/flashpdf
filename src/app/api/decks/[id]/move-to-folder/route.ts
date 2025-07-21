import { NextRequest, NextResponse } from 'next/server';
import { moveDeckToFolder } from '@/services/deck.service';
import { createClient } from '@/utils/supabase/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: userData, error: authError } = await supabase.auth.getUser();

    if (authError || !userData?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { folderId } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Deck ID is required' },
        { status: 400 }
      );
    }

    // Move the deck to the specified folder (or remove from folder if folderId is null)
    const updatedDeck = await moveDeckToFolder({
      deckId: id,
      folderId: folderId
    });

    return NextResponse.json(updatedDeck);
  } catch (error) {
    console.error('Error moving deck to folder:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
