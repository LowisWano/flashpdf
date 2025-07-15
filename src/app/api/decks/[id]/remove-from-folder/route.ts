import { NextRequest, NextResponse } from 'next/server';
import { removeDeckFromFolder } from '@/services/deck.service';
import { createClient } from '@/utils/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const deckId = params.id;
    
    await removeDeckFromFolder({ deckId });

    return NextResponse.json(
      { message: 'Deck removed from folder successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error removing deck from folder:', error);
    return NextResponse.json(
      { message: 'Failed to remove deck from folder' },
      { status: 500 }
    );
  }
}
