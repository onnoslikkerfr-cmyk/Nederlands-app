import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    return new Response("Geen MISTRAL_API_KEY ingesteld", { status: 501 });
  }

  const { verhaal, opdracht } = (await req.json()) as {
    verhaal: string;
    opdracht: string;
  };
  if (!verhaal || typeof verhaal !== "string") {
    return new Response("Geen verhaaltje ontvangen", { status: 400 });
  }

  const system =
    "Je bent een vriendelijke docent Nederlands voor een Franse leerlinge op niveau A2 (CEFR). " +
    "Lees haar verhaaltje en geef feedback in heel simpel Nederlands (korte zinnen, niveau A2, geen Frans). " +
    "Geef: (1) maximaal 2 spelfouten met de juiste spelling, (2) 1 compliment, (3) 1 tip om het volgende keer nog beter te doen. " +
    'Antwoord alleen met geldige JSON: {"feedback": "..."}.';

  const upstream = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.MISTRAL_MODEL || "mistral-small-latest",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: `De opdracht was: ${opdracht}\n\nHaar verhaaltje:\n${verhaal}`,
        },
      ],
    }),
  });

  if (!upstream.ok) {
    const body = await upstream.text().catch(() => "");
    return Response.json(
      { error: "Mistral gaf een fout", status: upstream.status, detail: body.slice(0, 300) },
      { status: upstream.status }
    );
  }

  const data = await upstream.json();
  const content = data?.choices?.[0]?.message?.content ?? "{}";
  let feedback = "Goed gedaan!";
  try {
    feedback = JSON.parse(content).feedback ?? feedback;
  } catch {
    feedback = content;
  }

  return Response.json({ feedback });
}
