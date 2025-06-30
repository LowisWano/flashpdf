import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { deleteDeck } from "@/services/deck.service"

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 })
  }

  const success = await deleteDeck(user.id, params.id)
  if (!success) {
    return NextResponse.json({ error: "Deck not found" }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
} 
