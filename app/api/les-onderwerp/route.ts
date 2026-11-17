import { NextRequest } from "next/server";
import { genereerOnderwerpLes } from "@/lib/lesgen";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Geen MISTRAL_API_KEY geconfigureerd in Vercel" },
      { status: 501 }
    );
  }

  const { onderwerp } = (await req.json()) as { onderwerp: string };
  if (!onderwerp || typeof onderwerp !== "string" || onderwerp.trim().length < 3) {
    return Response.json({ error: "Geen onderwerp ontvangen" }, { status: 400 });
  }

  const id = "onderwerp-" + Date.now().toString(36);
  const les = await genereerOnderwerpLes(onderwerp.trim(), id);
  if (!les) {
    return Response.json(
      { error: "De AI kon geen les maken van dit onderwerp. Probeer het opnieuw." },
      { status: 502 }
    );
  }
  return Response.json({ les });
}
