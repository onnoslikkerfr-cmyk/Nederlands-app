import { lessonsCache, todayKey } from "@/lib/dagcache";
import { haalJeugdjournaalArtikelen } from "@/lib/nieuws";
import { genereerLesMetMistral } from "@/lib/lesgen";
import { lessen } from "@/data/lessen";

export const dynamic = "force-dynamic";

export async function GET() {
  const date = todayKey();

  const cached = lessonsCache.get(date);
  if (cached) return Response.json({ les: cached, bron: "cache" });

  try {
    const artikelen = await haalJeugdjournaalArtikelen();
    for (const artikel of artikelen.slice(0, 3)) {
      const les = await genereerLesMetMistral(artikel, date);
      if (les) {
        lessonsCache.set(date, les);
        return Response.json({ les, bron: "nieuws" });
      }
    }
    throw new Error("Geen geschikte les gegenereerd");
  } catch {
    // Fallback: vaste reserveles, geroteerd per dag zodat elke dag iets anders is
    const index = dayOfYear(date) % lessen.length;
    const fallback = { ...lessen[index], id: date };
    lessonsCache.set(date, fallback);
    return Response.json({ les: fallback, bron: "reserve" });
  }
}

function dayOfYear(dateKey: string): number {
  const [y, m, d] = dateKey.split("-").map(Number);
  return Math.floor((Date.UTC(y, m - 1, d) - Date.UTC(y, 0, 0)) / 86400000);
}
