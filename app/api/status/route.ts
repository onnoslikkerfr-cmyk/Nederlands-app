export const dynamic = "force-dynamic";

// Diagnose: toont ALLEEN of de keys geconfigureerd zijn, nooit de waarden.
// Met ?ping=1 doet de server een echte test-aanroep naar Mistral.
export async function GET(req: Request) {
  const basis = {
    mistralKeyIngesteld: Boolean(process.env.MISTRAL_API_KEY),
    openaiKeyIngesteld: Boolean(process.env.OPENAI_API_KEY),
    tijd: new Date().toISOString(),
  };

  const url = new URL(req.url);
  if (url.searchParams.get("ping") !== "1" || !process.env.MISTRAL_API_KEY) {
    return Response.json(basis);
  }

  try {
    const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.MISTRAL_MODEL || "mistral-small-latest",
        messages: [{ role: "user", content: "Antwoord alleen met: OK" }],
      }),
    });
    const body = await res.text();
    return Response.json({
      ...basis,
      mistralPing: { status: res.status, ok: res.ok, detail: body.slice(0, 400) },
    });
  } catch (e) {
    return Response.json({ ...basis, mistralPing: { status: 0, ok: false, detail: String(e) } });
  }
}
