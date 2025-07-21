import { Folder } from "@/generated/prisma";
import { FolderWithDecks } from "@/lib/types";
import prisma from "@/lib/prisma";

export interface FolderEntry {
  name: string;
  description?: string;
  color?: string;
}

export async function getFolders(userId: string): Promise<FolderWithDecks[]> {
  const folders = await prisma.folder.findMany({
    where: {
      userId: userId,
    },
    include: {
      decks: true
    }
  });

  return folders;
}

export async function getFolderById(folderId: string): Promise<FolderWithDecks | null> {
  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
    include: {
      decks: {
        include: {
          flashcards: true
        }
      }
    }
  });
  
  return folder;
}

export async function createFolder({ userId, folder }: {
  userId: string,
  folder: FolderEntry,
}): Promise<FolderWithDecks> {
  const createdFolder = await prisma.folder.create({
    data: {
      name: folder.name,
      userId: userId,
      description: folder.description || "",
      color: folder.color || "#4F46E5",
    },
    include: {
      decks: true,
    },
  });

  return createdFolder;
}

export async function updateFolder({
  folderId,
  data,
}: {
  folderId: string;
  data: {
    name?: string;
    description?: string;
    color?: string;
  };
}): Promise<FolderWithDecks> {
  const updatedFolder = await prisma.folder.update({
    where: {
      id: folderId
    },
    data,
    include: {
      decks: true
    }
  });
  
  return updatedFolder;
}

export async function deleteFolder({
  folderId
}: {
  folderId: string
}){
  try {
    // Note: This won't delete the decks inside the folder,
    // it will just remove the folder association from the decks
    const folder = await prisma.folder.delete({
      where: { id: folderId }
    });

    return folder;
  } catch (error) {
    console.error('Error deleting folder:', error);
  }
}

export async function addDecksToFolder(
  folderId: string,
  deckIds: string[],
  userId: string
): Promise<boolean> {
  try {
    // Verify folder ownership
    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId,
        userId: userId
      }
    });
    
    if (!folder) {
      throw new Error('Folder not found or you do not have permission to access it');
    }
    
    // Update all the decks with the new folder ID
    await prisma.deck.updateMany({
      where: {
        id: {
          in: deckIds
        },
        userId: userId // Ensure user owns the decks
      },
      data: {
        folderId: folderId
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error adding decks to folder:', error);
    throw error;
  }
}
