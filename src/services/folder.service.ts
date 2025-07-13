import { Folder } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export interface FolderEntry {
  name: string;
  description?: string;
  color?: string;
}

export async function getFolders(userId: string): Promise<Folder[]> {
  const folders = await prisma.folder.findMany({
    where: {
      userId: userId,
    },
    include: {
      decks: true,
    }
  });

  return folders;
}

export async function getFolderById(folderId: string): Promise<Folder | null> {
  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
    include: {
      decks: {
        include: {
          flashcards: true,
        }
      }
    }
  });
  
  return folder;
}

export async function createFolder({ userId, folder }: {
  userId: string,
  folder: FolderEntry,
}): Promise<Folder> {
  const createdFolder = await prisma.folder.create({
    data: {
      name: folder.name,
      description: folder.description || "",
      color: folder.color || "#4F46E5",
      userId: userId,
    },
    include: {
      decks: true,
    },
  });

  return createdFolder;
}

export async function updateFolder({
  folderId,
  data
}: {
  folderId: string;
  data: {
    name?: string;
    description?: string;
    color?: string;
  }
}): Promise<Folder> {
  const updatedFolder = await prisma.folder.update({
    where: {
      id: folderId
    },
    data: {
      ...data,
      updatedAt: new Date()
    },
    include: {
      decks: true
    }
  });
  
  return updatedFolder;
}

export async function deleteFolder(folderId: string): Promise<boolean> {
  try {
    // Find all decks in this folder
    const decks = await prisma.deck.findMany({
      where: { folderId }
    });
    
    // Update decks to remove folder association (not deleting them)
    await prisma.deck.updateMany({
      where: { folderId },
      data: { folderId: null }
    });
    
    // Delete the folder
    await prisma.folder.delete({
      where: { id: folderId }
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting folder:', error);
    return false;
  }
}

export async function addDeckToFolder({
  deckId,
  folderId
}: {
  deckId: string;
  folderId: string;
}): Promise<boolean> {
  try {
    await prisma.deck.update({
      where: { id: deckId },
      data: { folderId }
    });
    return true;
  } catch (error) {
    console.error('Error adding deck to folder:', error);
    return false;
  }
}

export async function removeDeckFromFolder(deckId: string): Promise<boolean> {
  try {
    await prisma.deck.update({
      where: { id: deckId },
      data: { folderId: null }
    });
    return true;
  } catch (error) {
    console.error('Error removing deck from folder:', error);
    return false;
  }
}
