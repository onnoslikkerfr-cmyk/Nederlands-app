export type Vocab = {
  woord_vorm: string;
  toon: string;
  match_forms: string[];
  betekenis: string;
  voorbeeld: string;
};

export type Vervoeuging = {
  voor: string;
  na: string;
  ww: string;
  goed: string[];
};

export type InvulOefening = {
  voor: string;
  na: string;
  opties: string[];
  goed: string;
};

export type Les = {
  id: string;
  type: "nieuws" | "onderwerp";
  niveau: string;
  titel: string;
  emoji: string;
  bron: string;
  tekst: string;
  vocab: Vocab[];
  vervoeg: Vervoeuging[];
  invullen: InvulOefening[];
  opdracht: string;
};
// Opmerking: het verhaaltje bestaat uit 3 zinnen (was 4); kies steeds één leswoord.

export const lessen: Les[] = [
  {
    id: "1",
    type: "nieuws",
    niveau: "A2",
    titel: "Twee parels in één oester",
    emoji: "🦪",
    bron: "Naar een bericht van het Jeugdjournaal (vereenvoudigd en herschreven op niveau A2).",
    tekst:
      "In een restaurant in Zeeland vond een kok twee parels in één oester. Dat is heel zeldzaam. Meestal vind je maar één parel in een oester. De kok was er heel blij mee. Een parel groeit in de oester als er een klein stukje zand in de schelp komt. De oester maakt dan laagjes om het zand heen. Na een paar jaar is de parel klaar. De kok denkt dat de parels samen drieduizend euro waard zijn. Hij gaat ze verkopen aan een juwelier. Met het geld wil hij een nieuw fornuis kopen voor zijn restaurant.",
    vocab: [
      {
        woord_vorm: "zeldzaam",
        toon: "zeldzaam",
        match_forms: ["zeldzaam", "zeldzame"],
        betekenis: "Zeldzaam betekent: het gebeurt bijna nooit.",
        voorbeeld: "Een witte raaf is heel zeldzaam.",
      },
      {
        woord_vorm: "parel",
        toon: "parel",
        match_forms: ["parel", "parels"],
        betekenis: "Een parel is een mooi, rond ding dat in een oester groeit.",
        voorbeeld: "Ze draagt een ketting met parels.",
      },
      {
        woord_vorm: "oester",
        toon: "oester",
        match_forms: ["oester", "oesters"],
        betekenis: "Een oester is een dier met een harde schelp dat in zee leeft.",
        voorbeeld: "We eten oesters met citroen.",
      },
      {
        woord_vorm: "groeien",
        toon: "groeien",
        match_forms: ["groeien", "groeit"],
        betekenis: "Groeien betekent: groter worden.",
        voorbeeld: "Kinderen groeien snel.",
      },
      {
        woord_vorm: "schelp",
        toon: "schelp",
        match_forms: ["schelp"],
        betekenis: "De schelp is het harde huis van de oester.",
        voorbeeld: "Op het strand vind je mooie schelpen.",
      },
      {
        woord_vorm: "juwelier",
        toon: "juwelier",
        match_forms: ["juwelier"],
        betekenis: "Een juwelier is iemand die sieraden maakt en verkoopt.",
        voorbeeld: "De juwelier repareerde haar ring.",
      },
      {
        woord_vorm: "waard",
        toon: "waard",
        match_forms: ["waard"],
        betekenis: "Als iets waard is, kost het dat bedrag in geld.",
        voorbeeld: "Deze fiets is honderd euro waard.",
      },
      {
        woord_vorm: "fornuis",
        toon: "fornuis",
        match_forms: ["fornuis"],
        betekenis: "Het fornuis staat in de keuken. Daarop kook je.",
        voorbeeld: "Op het fornuis staat een pan met soep.",
      },
    ],
    vervoeg: [
      { voor: "De kok ", na: " de oester open.", ww: "maken", goed: ["maakt"] },
      { voor: "Een parel ", na: " in de oester.", ww: "groeien", goed: ["groeit"] },
    ],
    invullen: [
      {
        voor: "Dat kan jaren ",
        na: ".",
        opties: ["duren", "kosten", "slapen", "vallen", "lopen", "praten"],
        goed: "duren",
      },
      {
        voor: "Hij wil het geld gebruiken voor een nieuw ",
        na: ".",
        opties: ["fornuis", "boek", "tuin", "auto", "telefoon", "jas"],
        goed: "fornuis",
      },
    ],
    opdracht:
      "Schrijf zelf drie zinnen over een ding dat je hebt gevonden. Kies één woord uit de woordenlijst en gebruik het.",
  },
  {
    id: "2",
    type: "onderwerp",
    niveau: "A2",
    titel: "De markt op het plein",
    emoji: "🧺",
    bron: "Vrije les op niveau A2, geïnspireerd op het dagelijks leven in Nederland.",
    tekst:
      "Elke zaterdagmorgen gaat Sanne naar de markt op het plein. Daar koopt ze verse groente, kaas en bloemen. De markt begint om acht uur en is om één uur afgelopen. Sanne praat graag met de boeren. Ze vindt het leuk om te zien waar haar eten vandaan komt. Vorige week kocht ze aardbeien. Die waren heel zoet. Haar oma maakt er dan jam van. Sanne neemt altijd een eigen tas mee. Plastic tasjes kosten nu geld in de winkel. Zo helpt ze het milieu een beetje.",
    vocab: [
      {
        woord_vorm: "markt",
        toon: "markt",
        match_forms: ["markt"],
        betekenis: "Op de markt koop je verse producten van boeren.",
        voorbeeld: "De markt is elke week op het plein.",
      },
      {
        woord_vorm: "plein",
        toon: "plein",
        match_forms: ["plein"],
        betekenis: "Een plein is een open plek in het centrum van een stad.",
        voorbeeld: "De kinderen spelen op het plein.",
      },
      {
        woord_vorm: "vers",
        toon: "vers",
        match_forms: ["vers", "verse"],
        betekenis: "Vers betekent: net gemaakt of net geplukt, niet oud.",
        voorbeeld: "Ik koop het liefst vers brood.",
      },
      {
        woord_vorm: "boer",
        toon: "boer",
        match_forms: ["boer", "boeren"],
        betekenis: "Een boer werkt op het land en heeft vaak dieren.",
        voorbeeld: "De boer melkt elke ochtend zijn koeien.",
      },
      {
        woord_vorm: "zoet",
        toon: "zoet",
        match_forms: ["zoet"],
        betekenis: "Zoet is de smaak van suiker.",
        voorbeeld: "Deze appel is heel zoet.",
      },
      {
        woord_vorm: "jam",
        toon: "jam",
        match_forms: ["jam"],
        betekenis: "Jam maak je van fruit en suiker. Je doet het op brood.",
        voorbeeld: "Op mijn brood doe ik aardbeienjam.",
      },
      {
        woord_vorm: "tas",
        toon: "tas",
        match_forms: ["tas"],
        betekenis: "In een tas draag je je spullen.",
        voorbeeld: "Ik neem altijd een tas mee naar school.",
      },
      {
        woord_vorm: "milieu",
        toon: "milieu",
        match_forms: ["milieu"],
        betekenis: "Het milieu is de natuur om ons heen: lucht, water en aarde.",
        voorbeeld: "Fietsen is goed voor het milieu.",
      },
    ],
    vervoeg: [
      { voor: "Sanne ", na: " naar de markt.", ww: "gaan", goed: ["gaat"] },
      { voor: "De markt ", na: " om acht uur.", ww: "beginnen", goed: ["begint"] },
    ],
    invullen: [
      {
        voor: "Daar koopt ze verse ",
        na: " en kaas.",
        opties: ["groente", "huizen", "schoenen", "muziek", "televisies", "bomen"],
        goed: "groente",
      },
      {
        voor: "Plastic tasjes ",
        na: " nu geld in de winkel.",
        opties: ["kosten", "duren", "slapen", "vallen", "lopen", "praten"],
        goed: "kosten",
      },
    ],
    opdracht:
      "Schrijf zelf drie zinnen over boodschappen doen. Kies één woord uit de woordenlijst en gebruik het.",
  },
  {
    id: "3",
    type: "onderwerp",
    niveau: "A2",
    titel: "Koffie bij de buurvrouw",
    emoji: "☕",
    bron: "Vrije les op niveau A2, geïnspireerd op het dagelijks leven in Nederland.",
    tekst:
      "Elke woensdagochtend drinkt Peter koffie bij zijn buurvrouw Wies. Ze wonen in hetzelfde appartement. Wies is 78 jaar en woont al dertig jaar in de straat. Ze kent iedereen. Bij de koffie praten ze over het weer en over de buren. Vorige week was Wies jarig. Peter nam een taart mee. De buren kwamen allemaal even langs. Het was heel gezellig. Peter vindt het fijn om zo'n lieve buurvrouw te hebben. Niet iedereen heeft dat geluk.",
    vocab: [
      {
        woord_vorm: "buurvrouw",
        toon: "buurvrouw",
        match_forms: ["buurvrouw"],
        betekenis: "De buurvrouw is de vrouw die naast je woont.",
        voorbeeld: "Mijn buurvrouw leent me soms suiker.",
      },
      {
        woord_vorm: "appartement",
        toon: "appartement",
        match_forms: ["appartement"],
        betekenis: "Een appartement is een woning in een groot gebouw.",
        voorbeeld: "Wij wonen in een appartement op de derde verdieping.",
      },
      {
        woord_vorm: "straat",
        toon: "straat",
        match_forms: ["straat"],
        betekenis: "De straat is de weg waar de huizen aan staan.",
        voorbeeld: "Wij wonen in een rustige straat.",
      },
      {
        woord_vorm: "weer",
        toon: "weer",
        match_forms: ["weer"],
        betekenis: "Het weer is hoe het buiten is: zon, regen of wind.",
        voorbeeld: "Hoe is het weer morgen?",
      },
      {
        woord_vorm: "jarig",
        toon: "jarig",
        match_forms: ["jarig"],
        betekenis: "Als je jarig bent, is het vandaag je verjaardag.",
        voorbeeld: "Vandaag ben ik jarig!",
      },
      {
        woord_vorm: "taart",
        toon: "taart",
        match_forms: ["taart"],
        betekenis: "Een taart is een zoete cake, vaak voor een verjaardag.",
        voorbeeld: "Op mijn verjaardag eet ik chocoladetaart.",
      },
      {
        woord_vorm: "gezellig",
        toon: "gezellig",
        match_forms: ["gezellig"],
        betekenis: "Gezellig betekent: fijn en prettig samen met andere mensen.",
        voorbeeld: "We hadden een gezellige avond met vrienden.",
      },
      {
        woord_vorm: "geluk",
        toon: "geluk",
        match_forms: ["geluk"],
        betekenis: "Geluk hebben betekent: iets fijns meemaken.",
        voorbeeld: "Ik heb geluk met zo'n aardige baas.",
      },
    ],
    vervoeg: [
      { voor: "Peter ", na: " koffie bij Wies.", ww: "drinken", goed: ["drinkt"] },
      { voor: "Ze ", na: " al dertig jaar in de straat.", ww: "wonen", goed: ["woont"] },
    ],
    invullen: [
      {
        voor: "Peter nam een ",
        na: " mee.",
        opties: ["taart", "boek", "fiets", "plant", "telefoon", "jas"],
        goed: "taart",
      },
      {
        voor: "Het was heel ",
        na: ".",
        opties: ["gezellig", "zeldzaam", "duur", "moeilijk", "koud", "oud"],
        goed: "gezellig",
      },
    ],
    opdracht:
      "Schrijf zelf drie zinnen over iemand in jouw buurt. Kies één woord uit de woordenlijst en gebruik het.",
  },
];

export function getLes(id: string): Les | undefined {
  return lessen.find((les) => les.id === id);
}
