"use client";

import { useState } from "react";
import HelpSheet from "@/components/HelpSheet";
import type { Les, Vocab } from "@/data/lessen";

export default function StepVerhaaltje({
  les,
  onVerder,
}: {
  les: Les;
  onVerder: (tekst: string) => void;
}) {
  const woorden =
    les.schrijfwoorden?.length === 3
      ? les.schrijfwoorden
      : les.vocab.slice(0, 3).map((v) => v.toon);
  const [zinnen, setZinnen] = useState<string[]>(woorden.map(() => ""));
  const [hulpWoord, setHulpWoord] = useState<Vocab | null>(null);

  const ingevuld = zinnen.filter((z) => z.trim().length > 0).length;

  function vindVocab(woord: string): Vocab {
    return (
      les.vocab.find(
        (v) =>
          v.toon.toLowerCase() === woord.toLowerCase() ||
          v.match_forms.some((f) => f.toLowerCase() === woord.toLowerCase())
      ) ?? {
        woord_vorm: woord,
        toon: woord,
        match_forms: [woord],
        betekenis: "",
        voorbeeld: "",
      }
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-stone-900">✍️ Schrijven</h1>

      <div className="mt-4 rounded-3xl border border-amber-200 bg-white p-5 shadow-md">
        <p className="text-base leading-relaxed text-stone-800">{les.opdracht}</p>
      </div>

      <div className="mt-4 space-y-4">
        {woorden.map((woord, i) => (
          <div
            key={woord}
            className="rounded-3xl border border-amber-200 bg-white p-5 shadow-md"
          >
            <span className="inline-block rounded-full bg-amber-100 px-4 py-1.5 text-base font-bold text-amber-800">
              {woord}
            </span>
            <button
              onClick={() => setHulpWoord(vindVocab(woord))}
              aria-label={`Hulp bij ${woord}`}
              className="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700 transition active:scale-90"
            >
              ?
            </button>
            <textarea
              value={zinnen[i]}
              onChange={(e) =>
                setZinnen((prev) => prev.map((z, j) => (j === i ? e.target.value : z)))
              }
              rows={2}
              placeholder={`Schrijf hier één zin met het woord “${woord}”…`}
              className="mt-3 w-full rounded-2xl border-2 border-amber-200 bg-white p-3 text-base leading-relaxed text-stone-800 outline-none focus:border-amber-400"
            />
          </div>
        ))}
      </div>

      <p
        className={
          "mt-3 text-sm font-bold " +
          (ingevuld >= 3 ? "text-green-600" : "text-stone-500")
        }
      >
        {ingevuld} / 3 zinnen {ingevuld >= 3 ? "✓" : ""}
      </p>

      <button
        onClick={() => onVerder(zinnen.join("\n"))}
        disabled={ingevuld < 3}
        className="mt-6 w-full rounded-full bg-amber-500 py-4 text-lg font-bold text-white shadow-lg transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-stone-300"
      >
        Verder →
      </button>

      {hulpWoord && (
        <HelpSheet titel={hulpWoord.toon} onClose={() => setHulpWoord(null)}>
          {hulpWoord.synoniem && (
            <p className="text-sm font-bold uppercase tracking-wide text-stone-400">
              Synoniem: <span className="text-amber-700">{hulpWoord.synoniem}</span>
            </p>
          )}
          {hulpWoord.betekenis && (
            <p className="mt-2 text-base leading-relaxed text-stone-800">
              {hulpWoord.betekenis}
            </p>
          )}
          {hulpWoord.voorbeeld && (
            <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm italic text-stone-600">
              “{hulpWoord.voorbeeld}”
            </p>
          )}
        </HelpSheet>
      )}
    </div>
  );
}
