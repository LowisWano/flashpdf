import { Deck } from "@/generated/prisma";

export interface FolderWithDecks {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  decks: Deck[];
}
