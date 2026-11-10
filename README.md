# Dagelijks Nederlands

PWA voor een Franse A2-leerlinge: elke dag een les van ±5 minuten in vaste
volgorde — luisteren → lezen → oefenen → verhaaltje → klaar.

Stack: Next.js (App Router) + React + Tailwind CSS, mobile-first (max-width
480px), oranje/amber-stijl. Voortgang staat in localStorage. Stem (TTS) via de
Web Speech API van de browser (Nederlands, rate 1.0 of 0.65).

## Lokaal draaien

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

Icons regenereren: `node scripts/make-icons.mjs`

## Structuur

- `app/page.tsx` — Home (leerpad-kaart + onderwerp-kaart + niveaupills)
- `app/onderwerp/page.tsx` — onderwerp-prompt (in M1 nog zonder AI-koppeling)
- `app/les/[id]/page.tsx` — les-flow met 5 stappen
- `components/Step*.tsx` — Luisteren, Lezen (woordwolk bottom-sheet), Oefenen,
  Verhaaltje, Klaar (correctie-overzicht)
- `data/lessen.ts` — les-schema + 3 hardcoded A2-lessen
- `lib/tts.ts`, `lib/storage.ts` — Web Speech API en localStorage
- `public/manifest.webmanifest`, `public/sw.js` — PWA

## Deploy op Vercel

1. Push deze map naar een GitHub-repository.
2. Importeer de repo in Vercel (gratis tier) → automatische deploys.
3. Op de iPhone: open de deployed site in Safari → Delen →
   "Voeg toe aan het Beginscherm".

### AI-stem en AI-feedback (optioneel, fase 2)

Zonder keys werkt de app met de ingebouwde telefoonstem en een compliment.
Met keys krijg je een echte AI-stem en feedback op het verhaaltje. Zet in
Vercel (Project → Settings → Environment Variables) de keys uit `.env.example`:
`OPENAI_API_KEY` (stem, via platform.openai.com) en `MISTRAL_API_KEY`
(feedback, via console.mistral.ai). Nooit keys in de code zetten.

## Volgende mijlpalen (M2–M4)

- M2: automatische dagles via NOS/Jeugdjournaal-RSS + Mistral API-route
  (API-key in environment variable), caching per dag.
- M3: onderwerplessen via prompt + AI-feedback op het verhaaltje.
- M4: database + account, gespreide herhaling, extra niveaus, betaalde TTS.
