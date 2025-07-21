import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { addDecksToFolder } from '@/services/folder.service';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { folderId, deckIds } = await request.json();
    
    if (!folderId || !deckIds || !Array.isArray(deckIds) || deckIds.length === 0) {
      return NextResponse.json({ error: 'Invalid request. Missing folderId or deckIds' }, { status: 400 });
    }
    
    await addDecksToFolder(folderId, deckIds, user.id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error adding decks to folder:', error);
    return NextResponse.json({ error: error.message || 'Failed to add decks to folder' }, { status: 500 });
  }
}
