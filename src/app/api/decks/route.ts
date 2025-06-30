import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { createDeck } from "@/services/deck.service"

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 })
  }

  let payload: {
    title: string
    description: string
    topics?: string[]
    flashcards: { term: string; definition: string }[]
  }
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { title, description, flashcards, topics = [] } = payload

  if (!title || !description || !Array.isArray(flashcards) || flashcards.length < 2) {
    return NextResponse.json({ error: "Title, description and at least 2 flashcards are required." }, { status: 400 })
  }

  try {
    const deck = await createDeck(user.id, {
      title,
      description,
      topics,
      flashcards,
    })
    return NextResponse.json(deck, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to create deck" }, { status: 500 })
  }
} 
