"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LES_KEY } from "@/app/les/onderwerp/page";
import type { Les } from "@/data/lessen";

const SUGGESTIES = [
  "een afspraak maken bij de dokter",
  "boodschappen doen in de supermarkt",
  "jezelf voorstellen aan een nieuwe buur",
  "de weg vragen in een stad",
  "iets bestellen in een restaurant",
];

type Fase = "invoer" | "genereren" | "fout";

export default function OnderwerpPage() {
  const router = useRouter();
  const [invoer, setInvoer] = useState("");
  const [fase, setFase] = useState<Fase>("invoer");
  const [foutmelding, setFoutmelding] = useState("");

  async function maakLes() {
    if (!invoer.trim()) return;
    setFase("genereren");
    setFoutmelding("");
    try {
      const res = await fetch("/api/les-onderwerp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onderwerp: invoer.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFoutmelding(
          res.status === 501
            ? "De AI is nog niet gekoppeld (MISTRAL_API_KEY ontbreekt in Vercel)."
            : data.error ?? "Er ging iets mis. Probeer het opnieuw."
        );
        setFase("fout");
        return;
      }
      const les = data.les as Les;
      window.localStorage.setItem(LES_KEY, JSON.stringify(les));
      router.push("/les/onderwerp");
    } catch {
      setFoutmelding("Geen verbinding. Probeer het opnieuw.");
      setFase("fout");
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-[480px] px-5 pt-10 pb-12">
      <Link href="/" className="text-sm font-semibold text-amber-700">
        ← Terug
      </Link>

      {fase !== "genereren" && (
        <>
          <h1 className="mt-6 text-3xl font-extrabold text-stone-900">
            Kies zelf een onderwerp
          </h1>
          <p className="mt-2 text-stone-500">
            Typ waar je over wilt leren. Bijvoorbeeld: een afspraak maken bij de
            dokter…
          </p>

          <textarea
            value={invoer}
            onChange={(e) => setInvoer(e.target.value)}
            rows={3}
            placeholder="Bijvoorbeeld: een afspraak maken bij de dokter…"
            className="mt-6 w-full rounded-2xl border-2 border-amber-200 bg-white p-4 text-base text-stone-800 shadow-sm outline-none focus:border-amber-400"
          />

          <div className="mt-4 flex flex-wrap gap-2">
            {SUGGESTIES.map((s) => (
              <button
                key={s}
                onClick={() => setInvoer(s)}
                className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800 transition active:scale-95"
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={maakLes}
            disabled={!invoer.trim()}
            className="mt-8 w-full rounded-full bg-amber-500 py-4 text-lg font-bold text-white shadow-lg transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            ✨ Maak mijn les
          </button>
        </>
      )}

      {fase === "genereren" && (
        <div className="mt-24 flex flex-col items-center text-center">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-amber-200 border-t-amber-500" />
          <p className="mt-6 text-lg font-semibold text-stone-700">
            De AI maakt je les over “{invoer.trim()}”…
          </p>
        </div>
      )}

      {fase === "fout" && (
        <div className="mt-16 rounded-3xl border border-amber-200 bg-white p-6 text-center shadow-md">
          <div className="text-5xl">😕</div>
          <p className="mt-4 leading-relaxed text-stone-600">{foutmelding}</p>
          <button
            onClick={() => setFase("invoer")}
            className="mt-6 w-full rounded-full bg-amber-500 py-3.5 text-lg font-bold text-white shadow-lg transition active:scale-[0.98]"
          >
            Probeer opnieuw
          </button>
        </div>
      )}
    </main>
  );
}
