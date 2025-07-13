'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { createFolder, deleteFolder, updateFolder } from '@/services/folder.service'
import { redirect } from 'next/navigation'

export async function createFolderAction({
  name,
  description,
  color
}: {
  name: string
  description?: string
  color?: string
}) {
  try {
    const supabase = await createClient()
    
    const { data: userData, error } = await supabase.auth.getUser()
    if (error || !userData.user) {
      return { success: false, error: 'Unauthorized' }
    }

    if (!name || name.trim() === '') {
      return { success: false, error: 'Folder name is required' }
    }
    
    const folder = await createFolder({
      userId: userData.user.id,
      folder: {
        name,
        description,
        color
      }
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/folders")
    
    // Instead of redirect, return success so we can show a toast
    return { success: true, folder }
  } catch (error) {
    console.error('Error in createFolderAction:', error)
    return { success: false, error: 'An error occurred while creating the folder' }
  }
}

export async function updateFolderAction(
  folderId: string,
  {
    name,
    description,
    color
  }: {
    name?: string
    description?: string
    color?: string
  }
) {
  try {
    const supabase = await createClient()
    
    const { data: userData, error } = await supabase.auth.getUser()
    if (error || !userData.user) {
      return { success: false, error: 'Unauthorized' }
    }

    const data: any = {}
    if (name !== undefined) data.name = name
    if (description !== undefined) data.description = description
    if (color !== undefined) data.color = color

    await updateFolder({
      folderId,
      data
    })

    revalidatePath("/dashboard/folders")
    return { success: true }
  } catch (error) {
    console.error('Error in updateFolderAction:', error)
    return { success: false, error: 'An error occurred while updating the folder' }
  }
}

export async function deleteFolderAction(folderId: string) {
  try {
    const supabase = await createClient()
    
    const { data: userData, error } = await supabase.auth.getUser()
    if (error || !userData.user) {
      return { success: false, error: 'Unauthorized' }
    }

    const success = await deleteFolder(folderId)
    
    if (success) {
      revalidatePath("/dashboard/folders")
      return { success: true }
    } else {
      return { success: false, error: 'Failed to delete folder' }
    }
  } catch (error) {
    console.error('Error in deleteFolderAction:', error)
    return { success: false, error: 'An error occurred while deleting the folder' }
  }
}
