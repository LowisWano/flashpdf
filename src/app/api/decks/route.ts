import { NextRequest, NextResponse } from 'next/server';
import { getDecks, getDecksNotInFolder } from '@/services/deck.service';
import { createClient } from '@/utils/supabase/server';

export async function GET(
  request: NextRequest,
) {
  try {
    const { searchParams } = new URL(request.url);
    const excludeFolderId = searchParams.get('excludeFolderId') || '';
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    let decks;
    if (excludeFolderId) {
      // Get decks not in the specified folder
      decks = await getDecksNotInFolder(user.id, excludeFolderId);
    } else {
      // Get all decks
      decks = await getDecks(user.id);
    }

    return NextResponse.json(decks);
  } catch (error) {
    console.error('Error fetching decks:', error);
    return NextResponse.json(
      { message: 'Failed to fetch decks' },
      { status: 500 }
    );
  }
}
