"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { lessen } from "@/data/lessen";
import { firstUnfinishedLessonId } from "@/lib/storage";

const NIVEAUS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function Home() {
  const [leerpadId, setLeerpadId] = useState(lessen[0].id);

  useEffect(() => {
    setLeerpadId(firstUnfinishedLessonId(lessen.map((l) => l.id)));
  }, []);

  return (
    <main className="mx-auto min-h-screen w-full max-w-[480px] px-5 pt-10 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight text-amber-600">
          Dagelijks Nederlands
        </h1>
        <span className="rounded-full bg-amber-500 px-3 py-1 text-sm font-bold text-white shadow">
          A2
        </span>
      </div>

      <h2 className="mt-8 text-3xl font-extrabold text-stone-900">
        Wat wil je leren vandaag?
      </h2>
      <p className="mt-1 text-lg italic text-stone-500">
        Qu&apos;est-ce que tu veux apprendre aujourd&apos;hui&nbsp;?
      </p>

      <p className="mt-4 rounded-2xl bg-white/70 p-4 text-sm leading-relaxed text-stone-600 shadow-sm">
        Elke dag een les van ongeveer 5 minuten, in vaste volgorde:{" "}
        <span className="font-semibold text-amber-700">
          luisteren → lezen → oefenen → verhaaltje → klaar
        </span>
        .
      </p>

      <div className="mt-6 space-y-4">
        <Link
          href={`/les/${leerpadId}`}
          className="block rounded-3xl border border-amber-200 bg-white p-5 shadow-md transition active:scale-[0.98]"
        >
          <div className="text-4xl">📖</div>
          <div className="mt-3 text-xl font-bold text-stone-900">Het leerpad</div>
          <p className="mt-1 text-sm text-stone-500">
            Het nieuws van vandaag, omgezet in een les op jouw niveau.
          </p>
        </Link>

        <Link
          href="/onderwerp"
          className="block rounded-3xl border border-amber-200 bg-white p-5 shadow-md transition active:scale-[0.98]"
        >
          <div className="text-4xl">🎯</div>
          <div className="mt-3 text-xl font-bold text-stone-900">
            Kies zelf een onderwerp
          </div>
          <p className="mt-1 text-sm text-stone-500">
            Typ wat je wilt leren, de AI maakt de les voor jou.
          </p>
        </Link>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        {NIVEAUS.map((niveau) =>
          niveau === "A2" ? (
            <span
              key={niveau}
              className="rounded-full bg-amber-500 px-4 py-1.5 text-sm font-bold text-white shadow"
            >
              {niveau}
            </span>
          ) : (
            <span
              key={niveau}
              title="Komt later"
              className="cursor-not-allowed rounded-full bg-stone-200 px-4 py-1.5 text-sm font-semibold text-stone-400"
            >
              {niveau}
            </span>
          )
        )}
      </div>
    </main>
  );
}
