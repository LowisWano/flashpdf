export interface Flashcard {
  id: string;
  term: string;
  definition: string;
}

export interface Deck {
  id: number;
  title: string;
  description: string;
  flashcards: Flashcard[];
  topics: string[];
  studyProgress: number;
  cardCount: number;
  accuracy: number;
  lastStudied: string;
  isStarred: boolean;
} 


export function getDecks(): Deck[] {
  const decks: Deck[] = [
    {
      id: 1,
      title: "AppDev",
      description: "Flashcards for my Application Development class",
      flashcards: [
        {
          id: "1-1",
          term: "Spring Boot",
          definition: "An open-source Java framework used for programming standalone, production-grade Spring-based applications with a bundle of libraries that make project startup and management easier."
        },
        {
          id: "1-2",
          term: "Angular",
          definition: "A TypeScript-based free and open-source single-page web application framework."
        }
      ],
      topics: [
        "Web development",
        "NextJS",
        "UI/UX",
        "Tech Stack"
      ],
      studyProgress: 33,
      cardCount: 2,
      accuracy: 50,
      lastStudied: "2025-05-25",
      isStarred: true
    },
    {
      id: 2,
      title: "Thesis",
      description: "Flashcards for my Thesis class",
      flashcards: [
        {
          id: "2-1",
          term: "Spring Boot",
          definition: "An open-source Java framework used for programming standalone, production-grade Spring-based applications with a bundle of libraries that make project startup and management easier."
        },
        {
          id: "2-2",
          term: "Angular",
          definition: "A TypeScript-based free and open-source single-page web application framework."
        }
      ],
      topics: [
        "Web development",
        "NextJS"
      ],
      studyProgress: 33,
      cardCount: 2,
      accuracy: 50,
      lastStudied: "2025-05-25",
      isStarred: true
    },
    {
      id: 3,
      title: "Social Issues",
      description: "Flashcards for my Social Issues class",
      flashcards: [
        {
          id: "3-1",
          term: "Spring Boot",
          definition: "An open-source Java framework used for programming standalone, production-grade Spring-based applications with a bundle of libraries that make project startup and management easier."
        },
        {
          id: "3-2",
          term: "Angular",
          definition: "A TypeScript-based free and open-source single-page web application framework."
        }
      ],
      topics: [
        "Web development",
        "NextJS"
      ],
      studyProgress: 33,
      cardCount: 2,
      accuracy: 50,
      lastStudied: "2025-05-25",
      isStarred: true
    },
    {
      id: 4,
      title: "Social Issues",
      description: "Flashcards for my Social Issues class",
      flashcards: [
        {
          id: "4-1",
          term: "Spring Boot",
          definition: "An open-source Java framework used for programming standalone, production-grade Spring-based applications with a bundle of libraries that make project startup and management easier."
        },
        {
          id: "4-2",
          term: "Angular",
          definition: "A TypeScript-based free and open-source single-page web application framework."
        }
      ],
      topics: [
        "Web development",
        "NextJS"
      ],
      studyProgress: 33,
      cardCount: 2,
      accuracy: 50,
      lastStudied: "2025-05-25",
      isStarred: true
    },
    {
      id: 5,
      title: "Social Issues",
      description: "Flashcards for my Social Issues class",
      flashcards: [
        {
          id: "5-1",
          term: "Spring Boot",
          definition: "An open-source Java framework used for programming standalone, production-grade Spring-based applications with a bundle of libraries that make project startup and management easier."
        },
        {
          id: "5-2",
          term: "Angular",
          definition: "A TypeScript-based free and open-source single-page web application framework."
        }
      ],
      topics: [
        "Web development",
        "NextJS"
      ],
      studyProgress: 33,
      cardCount: 2,
      accuracy: 50,
      lastStudied: "2025-05-25",
      isStarred: true
    },
    {
      id: 6,
      title: "Social Issues",
      description: "Flashcards for my Social Issues class",
      flashcards: [
        {
          id: "6-1",
          term: "Spring Boot",
          definition: "An open-source Java framework used for programming standalone, production-grade Spring-based applications with a bundle of libraries that make project startup and management easier."
        },
        {
          id: "6-2",
          term: "Angular",
          definition: "A TypeScript-based free and open-source single-page web application framework."
        }
      ],
      topics: [
        "Web development",
        "NextJS"
      ],
      studyProgress: 33,
      cardCount: 2,
      accuracy: 50,
      lastStudied: "2025-05-25",
      isStarred: true
    },
    {
      id: 7,
      title: "Social Issues",
      description: "Flashcards for my Social Issues class",
      flashcards: [
        {
          id: "7-1",
          term: "Spring Boot",
          definition: "An open-source Java framework used for programming standalone, production-grade Spring-based applications with a bundle of libraries that make project startup and management easier."
        },
        {
          id: "7-2",
          term: "Angular",
          definition: "A TypeScript-based free and open-source single-page web application framework."
        }
      ],
      topics: [
        "Web development",
        "NextJS"
      ],
      studyProgress: 33,
      cardCount: 2,
      accuracy: 50,
      lastStudied: "2025-05-25",
      isStarred: true
    },
    {
      id: 8,
      title: "Social Issues",
      description: "Flashcards for my Social Issues class",
      flashcards: [
        {
          id: "8-1",
          term: "Spring Boot",
          definition: "An open-source Java framework used for programming standalone, production-grade Spring-based applications with a bundle of libraries that make project startup and management easier."
        },
        {
          id: "8-2",
          term: "Angular",
          definition: "A TypeScript-based free and open-source single-page web application framework."
        }
      ],
      topics: [
        "Web development",
        "NextJS"
      ],
      studyProgress: 33,
      cardCount: 2,
      accuracy: 50,
      lastStudied: "2025-05-25",
      isStarred: true
    },
    {
      id: 9,
      title: "Social Issues",
      description: "Flashcards for my Social Issues class",
      flashcards: [
        {
          id: "9-1",
          term: "Spring Boot",
          definition: "An open-source Java framework used for programming standalone, production-grade Spring-based applications with a bundle of libraries that make project startup and management easier."
        },
        {
          id: "9-2",
          term: "Angular",
          definition: "A TypeScript-based free and open-source single-page web application framework."
        }
      ],
      topics: [
        "Web development",
        "NextJS"
      ],
      studyProgress: 33,
      cardCount: 2,
      accuracy: 50,
      lastStudied: "2025-05-25",
      isStarred: true
    }
  ]

  return decks
}

export function addFlashcard(flashcards: Flashcard[]): Flashcard[] {
  const newCard: Flashcard = {
    id: generateUniqueId(flashcards),
    term: "",
    definition: "",
  }
  return [...flashcards, newCard]
}

export function removeFlashcard(flashcards: Flashcard[], id: string): Flashcard[] {
  if (flashcards.length > 1) {
    return flashcards.filter((card) => card.id !== id)
  }
  return flashcards
}

export function updateFlashcard(
  flashcards: Flashcard[], 
  id: string, 
  field: "term" | "definition", 
  value: string
): Flashcard[] {
  return flashcards.map((card) => 
    card.id === id ? { ...card, [field]: value } : card
  )
}

// Helper function to generate unique IDs for flashcards
export function generateUniqueId(existingFlashcards: Flashcard[] = []): string {
  const min = 1;
  const max = 999999;
  const maxAttempts = 1000;

  for (let attempts = 0; attempts < maxAttempts; attempts++) {
    const newId = (Math.floor(Math.random() * (max - min + 1)) + min).toString();
    if (!existingFlashcards.some(card => card.id === newId)) {
      return newId;
    }
  }

  throw new Error("Failed to generate a unique ID after 1000 attempts.");
}