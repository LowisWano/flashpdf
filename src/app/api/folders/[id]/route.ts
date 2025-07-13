import { createClient } from '@/utils/supabase/server'
import { getFolderById, updateFolder, deleteFolder } from '@/services/folder.service'
import { NextRequest, NextResponse } from 'next/server'

// GET a specific folder
export async function GET(
  request: NextRequest,
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
    
    const folder = await getFolderById(id)
    
    if (!folder) {
      return new NextResponse(JSON.stringify({ error: 'Folder not found' }), {
        status: 404,
      })
    }
    
    // Check if the folder belongs to the requesting user
    if (folder.userId !== userData.user.id) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
      })
    }
    
    return NextResponse.json({ folder })
  } catch (error) {
    console.error('Error getting folder:', error)
    return new NextResponse(JSON.stringify({ error: 'Failed to get folder' }), {
      status: 500,
    })
  }
}

// PATCH to update a folder
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    const id = params.id
    
    if (!userData?.user?.id) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      })
    }
    
    const { name, description, color } = await request.json()
    const updateData: any = {}
    
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (color !== undefined) updateData.color = color
    
    const folder = await updateFolder({
      folderId: id,
      data: updateData
    })
    
    return NextResponse.json({ success: true, folder })
  } catch (error) {
    console.error('Error updating folder:', error)
    return new NextResponse(JSON.stringify({ error: 'Failed to update folder' }), {
      status: 500,
    })
  }
}

// DELETE a folder
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    const id = params.id
    
    if (!userData?.user?.id) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      })
    }
    
    const success = await deleteFolder(id)
    
    if (!success) {
      return new NextResponse(JSON.stringify({ error: 'Failed to delete folder' }), {
        status: 500,
      })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting folder:', error)
    return new NextResponse(JSON.stringify({ error: 'Failed to delete folder' }), {
      status: 500,
    })
  }
}
