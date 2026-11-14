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
    "Lees haar verhaaltje. Geef feedback in heel simpel Nederlands (korte zinnen, niveau A2, geen Frans) als PLATTE TEKST — dus geen JSON, geen codes. " +
    "Geef 3 korte stukjes: (1) spelfouten: noem ALLEEN echte spelfouten met de juiste spelling. Controleer extra goed en verbeter NOOIT een woord dat al correct is: 'cover' is goed Nederlands, en 'hij stelt' is correct ('stellen' is meervoud). Als er geen spelfouten zijn, schrijf: 'Geen spelfouten, knap!'. " +
    "(2) één compliment; (3) één tip om het volgende keer nog beter te doen.";

  const upstream = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.MISTRAL_MODEL || "mistral-small-latest",
      temperature: 0.4,
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
    const jsonText = content.includes("{")
      ? content.slice(content.indexOf("{"), content.lastIndexOf("}") + 1)
      : content;
    feedback = JSON.parse(jsonText.replace(/```json/gi, "").replace(/```/g, "")).feedback ?? feedback;
  } catch {
    feedback = content;
  }

  return Response.json({ feedback });
}
