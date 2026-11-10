import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response("Geen OPENAI_API_KEY ingesteld", { status: 501 });
  }

  const { text, rate } = (await req.json()) as { text: string; rate: number };
  if (!text || typeof text !== "string") {
    return new Response("Geen tekst ontvangen", { status: 400 });
  }

  const model = process.env.OPENAI_TTS_MODEL || "tts-1-hd";
  const voice = process.env.OPENAI_TTS_VOICE || "nova";
  const speed = Math.min(4, Math.max(0.25, Number(rate) || 1));

  const upstream = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, voice, input: text.slice(0, 4000), speed }),
  });

  if (!upstream.ok) {
    return new Response("TTS-API gaf een fout", { status: upstream.status });
  }

  const audio = await upstream.arrayBuffer();
  return new Response(audio, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
    },
  });
}
