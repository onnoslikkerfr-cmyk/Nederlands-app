import type { Les } from "@/data/lessen";
import type { NieuwsItem } from "@/lib/nieuws";

const SCHEMA = `{
  "id": "2026-11-11",
  "type": "nieuws",
  "niveau": "A2",
  "titel": "Titel van de les",
  "emoji": "🦪",
  "bron": "Naar het Jeugdjournaal-artikel ... (vereenvoudigd en herschreven op niveau A2)",
  "bron_link": "https://jeugdjournaal.nl/l/...",
  "tekst": "De volledige leestekst (A2, 80-120 woorden, korte zinnen).",
  "vocab": [
    { "woord_vorm": "zeldzaam", "toon": "zeldzaam", "match_forms": ["zeldzaam", "zeldzame"],
      "betekenis": "Zeldzaam betekent: het gebeurt bijna nooit.", "voorbeeld": "Een witte raaf is heel zeldzaam.", "synoniem": "bijzonder", "voorbeelden": ["Het is zeldzaam om een vierbladige klaver te vinden."] }
  ],
  "vervoeg": [ { "voor": "De kok ", "na": " de oester open.", "ww": "maken", "goed": ["maakt"], "hulp": { "type": "regelmatig werkwoord", "vormen": "ik maak · jij maakt · hij/zij/het maakt · wij maken · jullie maken · zij maken" } } ],
  "invullen": [ { "voor": "Dat kan jaren ", "na": ".", "opties": ["duren","kosten","slapen","vallen","lopen","praten"], "goed": "duren" } ],
  "schrijfwoorden": ["woord1", "woord2", "woord3"],
  "opdracht": "Schrijf drie zinnen: maak voor elk woord hieronder één zin."
}`;

export function lesPrompt(artikel: NieuwsItem): string {
  return (
    "Je bent docent Nederlands voor volwassenen. Lees het meegeleverde nieuwsartikel en maak daar een complete les voor taalniveau A2 (CEFR). " +
    "BELANGRIJK: gebruik ALLEEN het meegeleverde artikel. Combineer het met geen enkel ander verhaal, verzin geen extra gebeurtenissen, en kies één duidelijk hoofdonderwerp. " +
    "Herschrijf dat ene artikel in je eigen woorden naar een tekst van 80-120 woorden met korte, simpele zinnen. " +
    "Het artikel is licht en kindvriendelijk; sla desondanks misdaad, oorlog en rampen over. " +
    "Volg exact dit JSON-schema: " + SCHEMA + " " +
    "Regels: 6-8 vocab-woorden met synoniem (indien beschikbaar); woord_vorm komt letterlijk voor in de tekst; 2 vervoeg-oefeningen elk met 'hulp' (type regelmatig/onregelmatig + volledige vervoeging); 2 invul-oefeningen met 6 opties (1 goed, 5 plausibel maar fout); " +
    "schrijfwoorden: precies 3 belangrijke woorden die letterlijk in de tekst voorkomen; de opdracht is: schrijf drie zinnen, één zin per schrijfwoord; " +
    "definities in héél simpel Nederlands, zonder Frans, alsof je tegen een 8-jarige praat; geef per woord een synoniem en 2-3 korte voorbeeldzinnen over het dagelijks leven (in 'voorbeelden'). " +
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
    if (!Array.isArray(l.schrijfwoorden) || l.schrijfwoorden.length !== 3) return null;
    if (!l.schrijfwoorden.every((w) => typeof w === "string" && tekstLaag.includes(w.toLowerCase()))) return null;
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
    les.bron = `Naar het Jeugdjournaal-artikel “${artikel.titel}” (vereenvoudigd en herschreven op niveau A2).`;
    les.bron_link = artikel.link;
  }
  return les;
}
