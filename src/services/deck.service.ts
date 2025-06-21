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
  const decks: Deck[] = [
    {
      id: 1,
      title: "AppDev",
      flashcards: [
        {
          term: "Spring Boot",
          definition: "An open-source Java framework used for programming standalone, production-grade Spring-based applications with a bundle of libraries that make project startup and management easier."
        },
        {
          term: "Angular",
          definition: "A TypeScript-based free and open-source single-page web application framework."
        }
      ],
      lastOpened: "2025-05-25"
    },
    {
      id: 2,
      title: "AppDev",
      flashcards: [
        {
          term: "spring boot",
          definition: "a java web framework"
        }
      ],
      lastOpened: "2025-05-25"
    },
    {
      id: 3,
      title: "AppDev",
      flashcards: [
        {
          term: "spring boot",
          definition: "a java web framework"
        }
      ],
      lastOpened: "2025-05-25"
    }
  ]

  return decks
}