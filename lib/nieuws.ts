export type NieuwsItem = {
  titel: string;
  link: string;
  tekst: string;
};

const FEED_URL = "https://feeds.nos.nl/jeugdjournaal";

const BLOKKEN = [
  "moord", "doodslag", "oorlog", "aanslag", "gijzel", "verkracht",
  "misdaad", "crimineel", "drugs", "zelfmoord", "terreur", "wapen",
  "vechtpartij", "mishandeling", "doodgeschoten", "neergeschoten",
  "explosie", "brandstichting", "inbraak", "overval", "dood", "dode",
];

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function isGeschikt(item: NieuwsItem): boolean {
  const check = (item.titel + " " + item.tekst).toLowerCase();
  if (item.tekst.length < 200) return false;
  return !BLOKKEN.some((w) => check.includes(w));
}

export async function haalJeugdjournaalArtikelen(): Promise<NieuwsItem[]> {
  const res = await fetch(FEED_URL, {
    headers: { "User-Agent": "DagelijksNederlands/1.0" },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error("Feed onbereikbaar: " + res.status);
  const xml = await res.text();
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  const gefilterd: NieuwsItem[] = [];
  for (const raw of items) {
    const titel = raw.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1]
      ?? raw.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "";
    const link = raw.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? "";
    const desc = raw.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1]
      ?? raw.match(/<description>([\s\S]*?)<\/description>/)?.[1] ?? "";
    const item: NieuwsItem = { titel: stripHtml(titel), link: link.trim(), tekst: stripHtml(desc) };
    if (isGeschikt(item)) gefilterd.push(item);
  }
  return gefilterd;
}
