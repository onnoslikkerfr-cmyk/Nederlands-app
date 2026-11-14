export const dynamic = "force-dynamic";

// Diagnose: toont ALLEEN of de keys geconfigureerd zijn, nooit de waarden.
export async function GET() {
  return Response.json({
    mistralKeyIngesteld: Boolean(process.env.MISTRAL_API_KEY),
    openaiKeyIngesteld: Boolean(process.env.OPENAI_API_KEY),
    tijd: new Date().toISOString(),
  });
}
