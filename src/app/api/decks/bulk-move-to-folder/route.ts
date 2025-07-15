import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { deckIds, folderId } = await request.json();

    if (!Array.isArray(deckIds) || deckIds.length === 0) {
      return NextResponse.json(
        { message: 'Invalid deckIds provided' },
        { status: 400 }
      );
    }

    // First verify all decks belong to the user
    const decks = await prisma.deck.findMany({
      where: {
        id: {
          in: deckIds
        },
        userId: user.id
      }
    });

    if (decks.length !== deckIds.length) {
      return NextResponse.json(
        { message: 'One or more decks not found or do not belong to the user' },
        { status: 403 }
      );
    }

    // Update all decks at once
    const updateResult = await prisma.deck.updateMany({
      where: {
        id: {
          in: deckIds
        },
        userId: user.id
      },
      data: {
        folderId: folderId || null
      }
    });

    return NextResponse.json({
      message: `Successfully moved ${updateResult.count} decks`,
      count: updateResult.count
    });
  } catch (error) {
    console.error('Error moving decks to folder:', error);
    return NextResponse.json(
      { message: 'Failed to move decks to folder' },
      { status: 500 }
    );
  }
}
