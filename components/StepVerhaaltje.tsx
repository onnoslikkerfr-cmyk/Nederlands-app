"use client";

import { useState } from "react";
import type { Les } from "@/data/lessen";

function telZinnen(tekst: string): number {
  return tekst
    .split(/[.!?…]+/)
    .map((z) => z.trim())
    .filter((z) => z.length > 0).length;
}

export default function StepVerhaaltje({
  les,
  onVerder,
}: {
  les: Les;
  onVerder: (tekst: string) => void;
}) {
  const [tekst, setTekst] = useState("");
  const zinnen = telZinnen(tekst);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-stone-900">✍️ Verhaaltje</h1>

      <div className="mt-4 rounded-3xl border border-amber-200 bg-white p-5 shadow-md">
        <p className="text-base leading-relaxed text-stone-800">{les.opdracht}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {les.vocab.map((v) => (
            <span
              key={v.toon}
              className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800"
            >
              {v.toon}
            </span>
          ))}
        </div>
      </div>

      <textarea
        value={tekst}
        onChange={(e) => setTekst(e.target.value)}
        rows={7}
        placeholder="Schrijf hier je verhaaltje…"
        className="mt-4 w-full rounded-3xl border-2 border-amber-200 bg-white p-4 text-base leading-relaxed text-stone-800 shadow-md outline-none focus:border-amber-400"
      />

      <p
        className={
          "mt-3 text-sm font-bold " +
          (zinnen >= 4 ? "text-green-600" : "text-stone-500")
        }
      >
        {Math.min(zinnen, 4)} / 4 zinnen {zinnen >= 4 ? "✓" : ""}
      </p>

      <button
        onClick={() => onVerder(tekst)}
        disabled={tekst.trim() === ""}
        className="mt-6 w-full rounded-full bg-amber-500 py-4 text-lg font-bold text-white shadow-lg transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-stone-300"
      >
        Verder →
      </button>
    </div>
  );
}
