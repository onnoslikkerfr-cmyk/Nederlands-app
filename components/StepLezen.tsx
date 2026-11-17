"use client";

import { useMemo, useState } from "react";
import type { Les, Vocab } from "@/data/lessen";

type Segment =
  | { type: "tekst"; value: string }
  | { type: "woord"; value: string; vocab: Vocab };

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function StepLezen({
  les,
  onVerder,
}: {
  les: Les;
  onVerder: () => void;
}) {
  const [bekeken, setBekeken] = useState<Set<string>>(new Set());
  const [actief, setActief] = useState<Vocab | null>(null);

  const segmenten = useMemo<Segment[]>(() => {
    const alleVormen = les.vocab.flatMap((v) =>
      v.match_forms.map((f) => ({ form: f, vocab: v }))
    );
    alleVormen.sort((a, b) => b.form.length - a.form.length);
    const regex = new RegExp(
      "\\b(?:" + alleVormen.map((f) => escapeRegex(f.form)).join("|") + ")\\b",
      "gi"
    );
    const result: Segment[] = [];
    const alGezien = new Set<string>();
    let laatste = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(les.tekst)) !== null) {
      if (match.index > laatste) {
        result.push({ type: "tekst", value: les.tekst.slice(laatste, match.index) });
      }
      const gevonden = alleVormen.find(
        (f) => f.form.toLowerCase() === match![0].toLowerCase()
      );
      const vocab = gevonden?.vocab ?? les.vocab[0];
      if (alGezien.has(vocab.toon)) {
        result.push({ type: "tekst", value: match[0] });
      } else {
        alGezien.add(vocab.toon);
        result.push({ type: "woord", value: match[0], vocab });
      }
      laatste = match.index + match[0].length;
    }
    if (laatste < les.tekst.length) {
      result.push({ type: "tekst", value: les.tekst.slice(laatste) });
    }
    return result;
  }, [les]);

  function openWoord(vocab: Vocab) {
    setActief(vocab);
    setBekeken((prev) => new Set(prev).add(vocab.toon));
  }

  return (
    <div className="pb-40">
      <h1 className="text-2xl font-extrabold text-stone-900">
        {les.emoji} {les.titel}
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        Tik op een oranje woord voor de betekenis.
      </p>

      <div className="mt-4 rounded-3xl border border-amber-200 bg-white p-5 text-lg leading-loose text-stone-800 shadow-md">
        {segmenten.map((seg, i) =>
          seg.type === "woord" ? (
            <button
              key={i}
              onClick={() => openWoord(seg.vocab)}
              className="mx-0.5 rounded-md px-1 font-bold text-amber-600 underline decoration-amber-300 decoration-2 underline-offset-4 transition active:bg-amber-100"
            >
              {seg.value}
            </button>
          ) : (
            <span key={i}>{seg.value}</span>
          )
        )}
      </div>

      <p className="mt-3 text-sm font-semibold text-stone-600">
        Woorden bekeken: {bekeken.size} van {les.vocab.length}
      </p>
      <p className="mt-2 text-xs italic text-stone-400">{les.bron}</p>
      {les.bron_link && (
        <a
          href={les.bron_link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-xs font-semibold text-amber-700 underline underline-offset-2"
        >
          🔗 Bekijk het originele artikel
        </a>
      )}

      <button
        onClick={onVerder}
        className="mt-8 w-full rounded-full bg-amber-500 py-4 text-lg font-bold text-white shadow-lg transition active:scale-[0.98]"
      >
        Verder →
      </button>

      {actief && (
        <div
          className="animate-fade-in fixed inset-0 z-20 bg-black/40"
          onClick={() => setActief(null)}
        >
          <div
            className="animate-sheet-up absolute inset-x-0 bottom-0 mx-auto w-full max-w-[480px] rounded-t-3xl bg-white p-6 shadow-2xl"
            style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-stone-200" />
            <h2 className="text-2xl font-extrabold text-amber-600">{actief.toon}</h2>
            {actief.synoniem && (
              <p className="mt-1 text-sm font-bold text-stone-500">
                Synoniem: <span className="text-amber-700">{actief.synoniem}</span>
              </p>
            )}
            <p className="mt-3 text-base leading-relaxed text-stone-700">
              {actief.betekenis}
            </p>
            {[actief.voorbeeld, ...(actief.voorbeelden ?? [])].map((vb, i) => (
              <p
                key={i}
                className="mt-2 rounded-xl bg-amber-50 p-3 text-sm italic text-stone-600"
              >
                “{vb}”
              </p>
            ))}
            <button
              onClick={() => setActief(null)}
              className="mt-5 w-full rounded-full bg-amber-500 py-3.5 text-lg font-bold text-white shadow transition active:scale-[0.98]"
            >
              Sluiten
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
