"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { OefenAntwoorden } from "@/components/StepOefenen";
import type { FeedbackData, Spelfout } from "@/app/api/feedback/route";
import type { Les } from "@/data/lessen";

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function MarkeerFouten({ tekst, fouten }: { tekst: string; fouten: string[] }) {
  if (fouten.length === 0) return <>{tekst}</>;
  const regex = new RegExp("\\b(" + fouten.map(escapeRegex).join("|") + ")\\b", "gi");
  const delen = tekst.split(regex);
  return (
    <>
      {delen.map((deel, i) =>
        i % 2 === 1 ? (
          <span
            key={i}
            title="Fout woord"
            className="font-bold text-red-600 underline decoration-red-400 decoration-2 underline-offset-2"
          >
            {deel}
          </span>
        ) : (
          <span key={i}>{deel}</span>
        )
      )}
    </>
  );
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
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [feedbackTekst, setFeedbackTekst] = useState<string | null>(null);
  const [feedbackBezig, setFeedbackBezig] = useState(false);
  const [feedbackFout, setFeedbackFout] = useState<number | null>(null);

  useEffect(() => {
    if (verhaal.trim() === "") return;
    let cancelled = false;
    setFeedbackBezig(true);
    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verhaal, opdracht: les.opdracht }),
    })
      .then((res) => {
        if (!res.ok) {
          setFeedbackFout(res.status);
          return Promise.reject(new Error("HTTP " + res.status));
        }
        return res.json();
      })
      .then((data: FeedbackData & { tekst?: string }) => {
        if (cancelled) return;
        if (Array.isArray(data.spelfouten)) setFeedback(data);
        else setFeedbackTekst(data.tekst ?? null);
      })
      .catch(() => {
        if (!cancelled) setFeedback(null);
      })
      .finally(() => {
        if (!cancelled) setFeedbackBezig(false);
      });
    return () => {
      cancelled = true;
    };
  }, [verhaal, les.opdracht]);

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
  const spelfouten: Spelfout[] = feedback?.spelfouten ?? [];

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
            Jouw zinnen
          </h2>
          <p className="whitespace-pre-line leading-relaxed text-stone-800">
            <MarkeerFouten tekst={verhaal} fouten={spelfouten.map((f) => f.fout)} />
          </p>
        </div>
      )}

      <div className="mt-4 rounded-3xl bg-green-50 p-5 shadow-sm">
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-green-700">
          🤖 Feedback op je zinnen
        </h2>
        {feedbackBezig && (
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-green-200 border-t-green-600" />
            <p className="text-sm text-stone-500">De AI kijkt je zinnen na…</p>
          </div>
        )}
        {!feedbackBezig && feedback && (
          <div className="space-y-3">
            {spelfouten.length === 0 && (
              <p className="text-base font-semibold text-green-800">
                ✅ Geen spelfouten, knap!
              </p>
            )}
            {spelfouten.map((f, i) => (
              <div key={i} className="rounded-xl bg-white/70 p-3">
                <p className="text-base">
                  <span className="font-bold text-red-600 line-through">{f.fout}</span>{" "}
                  → <span className="font-bold text-green-700">{f.goed}</span>
                </p>
                {f.uitleg && (
                  <p className="mt-1 text-sm italic text-stone-600">💡 {f.uitleg}</p>
                )}
              </div>
            ))}
            {feedback.compliment && (
              <p className="text-base font-semibold text-green-800">
                🌟 {feedback.compliment}
              </p>
            )}
            {feedback.tip && (
              <p className="text-sm text-stone-600">👉 Tip: {feedback.tip}</p>
            )}
          </div>
        )}
        {!feedbackBezig && !feedback && feedbackTekst && (
          <p className="whitespace-pre-line text-base leading-relaxed text-green-900">
            {feedbackTekst}
          </p>
        )}
        {!feedbackBezig && !feedback && !feedbackTekst && (
          <>
            <p className="text-base font-semibold text-green-800">
              🌟 Wat een mooie zinnen! Je leert heel snel Nederlands.
            </p>
            {feedbackFout && (
              <p className="mt-2 text-xs text-stone-400">
                AI-feedback niet beschikbaar (HTTP {feedbackFout}) — controleer
                MISTRAL_API_KEY in Vercel.
              </p>
            )}
          </>
        )}
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
