import { NextRequest, NextResponse } from 'next/server';
import { CohereClientV2, CohereError, CohereTimeoutError } from 'cohere-ai';
import { createDeck } from '@/services/deck.service';

export async function POST(req: NextRequest) {
  const apiKey = process.env.COHERE_APIKEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: "API key not set" }, { status: 500 });
  }

  try {
    const { text, userId, folderId } = await req.json();
    
    if (!text || !userId) {
      return NextResponse.json({ error: "Missing text or user ID" }, { status: 400 });
    }

    const cohere = new CohereClientV2({ 
      token: apiKey
    });

    const chat = await cohere.chat({
      model: "command-a-03-2025",
      responseFormat: {
        type: "json_object",
        jsonSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            flashcards: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  term: { type: "string" },
                  definition: { type: "string" }
                },
                required: ["term", "definition"]
              }
            }
          },
          required: ["title", "flashcards"]
        }
      },
      messages: [
        {
          role: "system",
          content: `
            Generate a JSON data strictly in this format:

            {
              title: string;
              flashcards: {
                term: string;
                definition: string;  
              }[];
            }

            Strictly follow these instructions:

            1. Set the "title" field to a concise summary or main topic of the given text.
            2. Create the "flashcards" array by extracting key terms and their definitions from the given text.
            3. Each flashcard should be a JSON object with exactly two fields: "term" and "definition".
            4. Use the original text as much as possible, but you may lightly rephrase or clarify ambiguous or complex content to produce clear and concise term-definition pairs.
            5. Ensure the output is valid JSON, properly formatted with correct syntax and punctuation.
            6. If the text contains multiple key concepts, generate one flashcard per concept.
            7. Avoid adding explanations, commentary, or content outside the described JSON structure.
            8. If there is undefined data, use an empty string
          `,
        },{
          role: "user",
          content: text
        }
      ],
    });
    const responseText = chat.message?.content?.[0]?.text;
    if (!responseText) {
      return NextResponse.json({ error: "Invalid response from Cohere" }, { status: 500 });
    }

    const responseData = JSON.parse(responseText);

    const deck = await createDeck({
      userId: userId,
      deck: {
        title: responseData.title,
        flashcards: responseData.flashcards,
        cardCount: responseData.flashcards.length,
        folderId: folderId || undefined
      }
    });

    return NextResponse.json({ success: "Successfully created flashcards", deck })
  } catch(err){
    if (err instanceof CohereTimeoutError) {
      console.log("Request timed out", err);
      return NextResponse.json({ error: "Request timed out" }, { status: 408 });
    } else if (err instanceof CohereError) {
      console.log(err.statusCode);
      console.log(err.message);
      console.log(err.body);
      return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
    } else {
      console.log("Unexpected error:", err);
      return NextResponse.json({ error: "Internal server error from cohere" }, { status: 500 });
    }
  }
}