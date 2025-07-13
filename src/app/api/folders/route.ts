import { createClient } from '@/utils/supabase/server'
import { createFolder, getFolders } from '@/services/folder.service'
import { NextRequest, NextResponse } from 'next/server'

// GET all folders for a user
export async function GET(
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
    
    const folders = await getFolders(userData.user.id)
    
    return NextResponse.json({ folders })
  } catch (error) {
    console.error('Error getting folders:', error)
    return new NextResponse(JSON.stringify({ error: 'Failed to get folders' }), {
      status: 500,
    })
  }
}

// POST to create a new folder
export async function POST(
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
    
    const { name, description, color } = await request.json()
    
    if (!name || name.trim() === '') {
      return new NextResponse(JSON.stringify({ error: 'Folder name is required' }), {
        status: 400,
      })
    }
    
    const folder = await createFolder({
      userId: userData.user.id,
      folder: {
        name,
        description,
        color
      }
    })
    
    return NextResponse.json({ success: true, folder })
  } catch (error) {
    console.error('Error creating folder:', error)
    return new NextResponse(JSON.stringify({ error: 'Failed to create folder' }), {
      status: 500,
    })
  }
}
