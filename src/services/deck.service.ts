export interface Flashcard {
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
          term: "Spring Boot",
          definition: "An open-source Java framework used for programming standalone, production-grade Spring-based applications with a bundle of libraries that make project startup and management easier."
        },
        {
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
          term: "Spring Boot",
          definition: "An open-source Java framework used for programming standalone, production-grade Spring-based applications with a bundle of libraries that make project startup and management easier."
        },
        {
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
          term: "Spring Boot",
          definition: "An open-source Java framework used for programming standalone, production-grade Spring-based applications with a bundle of libraries that make project startup and management easier."
        },
        {
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
          term: "Spring Boot",
          definition: "An open-source Java framework used for programming standalone, production-grade Spring-based applications with a bundle of libraries that make project startup and management easier."
        },
        {
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
          term: "Spring Boot",
          definition: "An open-source Java framework used for programming standalone, production-grade Spring-based applications with a bundle of libraries that make project startup and management easier."
        },
        {
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