import type { Les } from "@/data/lessen";
import type { NieuwsItem } from "@/lib/nieuws";

const SCHEMA = `{
  "id": "2026-11-11",
  "type": "nieuws",
  "niveau": "A2",
  "titel": "Titel van de les",
  "emoji": "🦪",
  "bron": "Naar het Jeugdjournaal-artikel ... (vereenvoudigd en herschreven op niveau A2)",
  "tekst": "De volledige leestekst (A2, 80-120 woorden, korte zinnen).",
  "vocab": [
    { "woord_vorm": "zeldzaam", "toon": "zeldzaam", "match_forms": ["zeldzaam", "zeldzame"],
      "betekenis": "Zeldzaam betekent: het gebeurt bijna nooit.", "voorbeeld": "Een witte raaf is heel zeldzaam." }
  ],
  "vervoeg": [ { "voor": "De kok ", "na": " de oester open.", "ww": "maken", "goed": ["maakt"] } ],
  "invullen": [ { "voor": "Dat kan jaren ", "na": ".", "opties": ["duren","kosten","slapen","vallen","lopen","praten"], "goed": "duren" } ],
  "opdracht": "Schrijf zelf drie zinnen. Kies één woord uit de leswoorden en gebruik het."
}`;

export function lesPrompt(artikel: NieuwsItem): string {
  return (
    "Je bent docent Nederlands voor volwassenen. Lees het meegeleverde nieuwsartikel en maak daar een complete les voor taalniveau A2 (CEFR). " +
    "BELANGRIJK: gebruik ALLEEN het meegeleverde artikel. Combineer het met geen enkel ander verhaal, verzin geen extra gebeurtenissen, en kies één duidelijk hoofdonderwerp. " +
    "Herschrijf dat ene artikel in je eigen woorden naar een tekst van 80-120 woorden met korte, simpele zinnen. " +
    "Het artikel is licht en kindvriendelijk; sla desondanks misdaad, oorlog en rampen over. " +
    "Volg exact dit JSON-schema: " + SCHEMA + " " +
    "Regels: 6-8 vocab-woorden; woord_vorm komt letterlijk voor in de tekst; 2 vervoeg-oefeningen; 2 invul-oefeningen met 6 opties (1 goed, 5 plausibel maar fout); " +
    "definities in heel simpel Nederlands, zonder Frans; voorbeeldzinnen over het dagelijks leven; de opdracht is: schrijf zelf drie zinnen en kies één leswoord. " +
    "Antwoord alleen met geldige JSON.\n\nARTIKEL TITEL: " + artikel.titel + "\nARTIKEL TEKST: " + artikel.tekst.slice(0, 4000)
  );
}

export function valideerLes(data: unknown, id: string): Les | null {
  try {
    const l = data as Les;
    if (!l || typeof l !== "object") return null;
    if (typeof l.titel !== "string" || !l.titel) return null;
    if (typeof l.tekst !== "string" || l.tekst.length < 100) return null;
    if (!Array.isArray(l.vocab) || l.vocab.length < 6 || l.vocab.length > 8) return null;
    const tekstLaag = l.tekst.toLowerCase();
    for (const v of l.vocab) {
      if (!v.woord_vorm || !Array.isArray(v.match_forms) || v.match_forms.length === 0) return null;
      if (!v.match_forms.some((f) => tekstLaag.includes(f.toLowerCase()))) return null;
      if (!v.betekenis || !v.voorbeeld) return null;
    }
    if (!Array.isArray(l.vervoeg) || l.vervoeg.length !== 2) return null;
    if (!Array.isArray(l.invullen) || l.invullen.length !== 2) return null;
    for (const i of l.invullen) {
      if (!Array.isArray(i.opties) || i.opties.length !== 6 || !i.goed) return null;
    }
    if (typeof l.opdracht !== "string" || !l.opdracht) return null;
    return { ...l, id, type: "nieuws", niveau: "A2", emoji: l.emoji || "📰" };
  } catch {
    return null;
  }
}

export async function genereerLesMetMistral(artikel: NieuwsItem, id: string): Promise<Les | null> {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) return null;
  const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.MISTRAL_MODEL || "mistral-small-latest",
      temperature: 0.3,
      messages: [
        { role: "system", content: "Je bent een ervaren docent Nederlands. Je antwoordt alleen met geldige JSON." },
        { role: "user", content: lesPrompt(artikel) },
      ],
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content ?? "";
  const jsonText = content.includes("{")
    ? content.slice(content.indexOf("{"), content.lastIndexOf("}") + 1)
    : content;
  const parsed = JSON.parse(jsonText.replace(/```json/gi, "").replace(/```/g, ""));
  const les = valideerLes(parsed, id);
  if (les) {
    les.bron = `Naar het Jeugdjournaal-artikel “${artikel.titel}” (vereenvoudigd en herschreven op niveau A2). ${artikel.link}`;
  }
  return les;
}
