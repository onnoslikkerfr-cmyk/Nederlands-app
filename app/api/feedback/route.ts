import { NextRequest } from "next/server";

export type Spelfout = { fout: string; goed: string; uitleg: string };
export type FeedbackData = {
  spelfouten: Spelfout[];
  compliment: string;
  tip: string;
};

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
    "Lees haar zinnen. Geef feedback in heel simpel Nederlands (korte zinnen, niveau A2, geen Frans). " +
    'Antwoord ALLEEN met geldige JSON in dit formaat: {"spelfouten":[{"fout":"het foute woord zoals in de tekst","goed":"het juiste woord","uitleg":"in één simpele zin WAAROM het fout is, bijv. hij is enkelvoud dus stelt en niet stellen"}],"compliment":"één compliment","tip":"één tip"}. ' +
    "Regels: noem ALLEEN echte spelfouten of grammaticafouten. Verbeter NOOIT een correct woord: 'cover' is goed Nederlands, 'hij stelt' is correct ('stellen' is meervoud). " +
    "Als er geen fouten zijn: spelfouten is een lege lijst.";

  const upstream = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.MISTRAL_MODEL || "mistral-small-latest",
      temperature: 0.3,
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: `De opdracht was: ${opdracht}\n\nHaar zinnen:\n${verhaal}`,
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
  const content = data?.choices?.[0]?.message?.content ?? "";
  try {
    const jsonText = content.includes("{")
      ? content.slice(content.indexOf("{"), content.lastIndexOf("}") + 1)
      : content;
    const parsed = JSON.parse(jsonText.replace(/```json/gi, "").replace(/```/g, ""));
    const feedback: FeedbackData = {
      spelfouten: Array.isArray(parsed.spelfouten)
        ? parsed.spelfouten
            .filter((f: Spelfout) => f && f.fout && f.goed)
            .map((f: Spelfout) => ({
              fout: String(f.fout),
              goed: String(f.goed),
              uitleg: String(f.uitleg ?? ""),
            }))
        : [],
      compliment: String(parsed.compliment ?? "Goed gedaan!"),
      tip: String(parsed.tip ?? ""),
    };
    return Response.json(feedback);
  } catch {
    return Response.json({ tekst: content } as { tekst: string });
  }
}
