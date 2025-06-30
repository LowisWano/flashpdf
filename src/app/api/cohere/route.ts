import { NextRequest, NextResponse } from 'next/server';
import { CohereClientV2, CohereError, CohereTimeoutError } from 'cohere-ai';

export async function POST(req: NextRequest) {
  const apiKey = process.env.COHERE_APIKEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: "API key not set" }, { status: 500 });
  }

  try {
    const { text } = await req.json();
    
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const cohere = new CohereClientV2({ 
      token: apiKey
    });

    const chat = await cohere.chat({
      model: "command-a-03-2025",
      responseFormat: {type: "json_object"},
      messages: [
        {
          role: "system",
          content: `
            Generate an array of JSON objects in the following format:

            {
              term: string;
              definition: string;    
            }

            Instructions:

            1. Create an array of flashcards JSON object by extracting key terms and their definitions from the given text.
            2. Each flashcard should be a JSON object with exactly two fields: "term" and "definition".
            3. Use the original text as much as possible, but you may lightly rephrase or clarify ambiguous or complex content to make clear and concise term-definition pairs.
            4. Ensure the output is valid JSON (an array of objects), with proper syntax and punctuation.
            5. If the text contains multiple key concepts, generate one flashcard per concept.
            6. Avoid including explanations, commentary, or anything outside the JSON array.
          `,
        },{
          role: "user",
          content: text
        }
      ],
    });
    
    return NextResponse.json({ flashcards: chat.message });
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