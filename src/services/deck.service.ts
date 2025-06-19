export interface Flashcard {
  term: string;
  definition: string;
}

export interface Deck {
  id: number;
  title: string;
  flashcards: Flashcard[];
  lastOpened: string;
}

export function getDecks(): Deck[] {
  return []
}