import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.LLMWHISPER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not set" }, { status: 500 });
  }

  // Get the raw PDF file from the request body
  const pdfBuffer = await req.arrayBuffer();

  // Forward the request to LLMWhisper
  const whisperRes = await fetch("https://llmwhisperer-api.us-central.unstract.com/api/v2/whisper", {
    method: "POST",
    headers: {
      "unstract-key": apiKey,
      "Content-Type": "application/octet-stream",
    },
    body: pdfBuffer,
  });

  // Forward the response from LLMWhisper to the client
  const data = await whisperRes.json();
  return NextResponse.json(data, { status: whisperRes.status });
}

export async function GET(req: NextRequest) {
  const apiKey = process.env.LLMWHISPER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not set" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const whisper_hash = searchParams.get("whisper_hash");
  const type = searchParams.get("type"); // "status" or "retrieve"

  if (!whisper_hash) {
    return NextResponse.json({ error: "Missing whisper_hash" }, { status: 400 });
  }

  let url = "";
  if (type === "status") {
    url = `https://llmwhisperer-api.us-central.unstract.com/api/v2/whisper-status?whisper_hash=${encodeURIComponent(whisper_hash)}`;
  } else {
    url = `https://llmwhisperer-api.us-central.unstract.com/api/v2/whisper-retrieve?whisper_hash=${encodeURIComponent(whisper_hash)}`;
  }

  const whisperRes = await fetch(url, {
    method: "GET",
    headers: {
      "unstract-key": apiKey,
    },
  });

  const data = await whisperRes.json();
  return NextResponse.json(data, { status: whisperRes.status });
}