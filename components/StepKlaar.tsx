"use client";

import Link from "next/link";
import type { OefenAntwoorden } from "@/components/StepOefenen";
import type { Les } from "@/data/lessen";

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

type Regel = { label: string; ok: boolean; goed: string };

export default function StepKlaar({
  les,
  antwoorden,
  verhaal,
}: {
  les: Les;
  antwoorden: OefenAntwoorden;
  verhaal: string;
}) {
  const regels: Regel[] = [
    ...les.vervoeg.map((o, i) => ({
      label: `${o.voor}___${o.na} (${o.ww})`,
      ok: o.goed.map(normalize).includes(normalize(antwoorden.vervoeg[i] ?? "")),
      goed: o.goed[0],
    })),
    ...les.invullen.map((o, i) => ({
      label: `${o.voor}___${o.na}`,
      ok: normalize(antwoorden.invullen[i] ?? "") === normalize(o.goed),
      goed: o.goed,
    })),
  ];

  const goedAantal = regels.filter((r) => r.ok).length;

  return (
    <div>
      <div className="text-center">
        <div className="text-6xl">🎉</div>
        <h1 className="mt-3 text-3xl font-extrabold text-stone-900">Goed gedaan!</h1>
        <p className="mt-1 text-stone-500">
          Je hebt {goedAantal} van {regels.length} oefeningen goed.
        </p>
      </div>

      <div className="mt-6 space-y-2 rounded-3xl border border-amber-200 bg-white p-5 shadow-md">
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-stone-400">
          Correctie
        </h2>
        {regels.map((r, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <span
              className={
                "mt-0.5 font-bold " + (r.ok ? "text-green-600" : "text-red-500")
              }
            >
              {r.ok ? "✓" : "✗"}
            </span>
            <span className="text-stone-700">
              {r.label.replace("___", r.ok ? " " : ` ${r.goed} `)}
              {!r.ok && (
                <span className="ml-1 font-semibold text-green-700">
                  (goed: {r.goed})
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      {verhaal.trim() !== "" && (
        <div className="mt-4 rounded-3xl border border-amber-200 bg-white p-5 shadow-md">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-stone-400">
            Jouw verhaaltje
          </h2>
          <p className="whitespace-pre-line leading-relaxed text-stone-800">{verhaal}</p>
        </div>
      )}

      <div className="mt-4 rounded-3xl bg-green-50 p-5 text-center shadow-sm">
        <p className="text-base font-semibold text-green-800">
          🌟 Wat een mooi verhaaltje! Je leert heel snel Nederlands.
        </p>
      </div>

      <Link
        href="/"
        className="mt-8 block w-full rounded-full bg-amber-500 py-4 text-center text-lg font-bold text-white shadow-lg transition active:scale-[0.98]"
      >
        Terug naar begin
      </Link>
    </div>
  );
}
