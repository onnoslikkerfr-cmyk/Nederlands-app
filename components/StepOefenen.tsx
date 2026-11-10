"use client";

import { useState } from "react";
import type { Les } from "@/data/lessen";

export type OefenAntwoorden = {
  vervoeg: string[];
  invullen: string[];
};

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

export default function StepOefenen({
  les,
  onVerder,
}: {
  les: Les;
  onVerder: (antwoorden: OefenAntwoorden) => void;
}) {
  const [vervoeg, setVervoeg] = useState<string[]>(les.vervoeg.map(() => ""));
  const [invullen, setInvullen] = useState<string[]>(les.invullen.map(() => ""));

  const allesIngevuld =
    vervoeg.every((a) => a.trim() !== "") &&
    invullen.every((a) => a.trim() !== "");

  function VervoeugVeld({ index }: { index: number }) {
    const o = les.vervoeg[index];
    const antwoord = normalize(vervoeg[index]);
    const state = antwoord === ""
      ? "leeg"
      : o.goed.map(normalize).includes(antwoord)
        ? "goed"
        : "fout";
    return (
      <p className="text-lg leading-relaxed text-stone-800">
        {o.voor}
        <input
          value={vervoeg[index]}
          onChange={(e) =>
            setVervoeg((prev) => prev.map((v, i) => (i === index ? e.target.value : v)))
          }
          aria-label={`Vervoeging van ${o.ww}`}
          className={
            "mx-1 inline-block w-32 rounded-lg border-2 px-2 py-1 text-center font-semibold outline-none " +
            (state === "goed"
              ? "border-green-500 bg-green-50 text-green-700"
              : state === "fout"
                ? "border-red-400 bg-red-50 text-red-700"
                : "border-amber-300 bg-white focus:border-amber-500")
          }
        />
        {o.na} <span className="text-sm text-stone-400">({o.ww})</span>
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-stone-900">✏️ Oefenen</h1>
      <p className="mt-1 text-sm text-stone-500">
        Vul de juiste vorm van het werkwoord in.
      </p>

      <div className="mt-4 space-y-4 rounded-3xl border border-amber-200 bg-white p-5 shadow-md">
        {les.vervoeg.map((_, i) => (
          <VervoeugVeld key={i} index={i} />
        ))}
      </div>

      <p className="mt-8 text-sm font-semibold text-stone-500">
        Kies het juiste woord.
      </p>

      <div className="mt-3 space-y-6">
        {les.invullen.map((o, i) => (
          <div
            key={i}
            className="rounded-3xl border border-amber-200 bg-white p-5 shadow-md"
          >
            <p className="text-lg text-stone-800">
              {o.voor}
              <span className="mx-1 inline-block min-w-16 rounded-lg bg-amber-100 px-2 py-0.5 text-center font-bold text-amber-700">
                {invullen[i] || "…"}
              </span>
              {o.na}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {o.opties.map((optie) => {
                const gekozen = invullen[i] === optie;
                return (
                  <button
                    key={optie}
                    onClick={() =>
                      setInvullen((prev) =>
                        prev.map((v, j) => (j === i ? optie : v))
                      )
                    }
                    className={
                      "rounded-full px-4 py-2 text-sm font-semibold transition active:scale-95 " +
                      (gekozen
                        ? "bg-amber-500 text-white shadow"
                        : "bg-stone-100 text-stone-600")
                    }
                  >
                    {optie}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => onVerder({ vervoeg, invullen })}
        disabled={!allesIngevuld}
        className="mt-8 w-full rounded-full bg-amber-500 py-4 text-lg font-bold text-white shadow-lg transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-stone-300"
      >
        Verder →
      </button>
    </div>
  );
}
