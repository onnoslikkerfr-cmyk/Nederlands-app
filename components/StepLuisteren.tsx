"use client";

import { useEffect, useState } from "react";
import { ensureVoices, speak, stopSpeaking } from "@/lib/tts";
import type { Les } from "@/data/lessen";

export default function StepLuisteren({
  les,
  onVerder,
}: {
  les: Les;
  onVerder: () => void;
}) {
  const [speelt, setSpeelt] = useState(false);

  useEffect(() => {
    ensureVoices();
    return () => stopSpeaking();
  }, []);

  function speel(rate: number) {
    setSpeelt(true);
    speak(les.tekst, rate, () => setSpeelt(false));
  }

  return (
    <div className="flex flex-col items-center pt-4 text-center">
      <div className="text-6xl">{les.emoji}</div>
      <h1 className="mt-3 text-2xl font-extrabold text-stone-900">{les.titel}</h1>

      <button
        onClick={() => (speelt ? (stopSpeaking(), setSpeelt(false)) : speel(1))}
        aria-label="Afspelen"
        className="mt-10 flex h-28 w-28 items-center justify-center rounded-full bg-amber-500 text-5xl text-white shadow-xl transition active:scale-95"
      >
        {speelt ? "⏹" : "▶"}
      </button>
      <p className="mt-3 font-semibold text-stone-700">
        {speelt ? "Speelt af…" : "Afspelen"}
      </p>

      <button
        onClick={() => speel(0.65)}
        className="mt-2 text-sm font-semibold text-amber-700 underline underline-offset-4"
      >
        🐢 Luister langzaam
      </button>

      <button
        onClick={onVerder}
        className="mt-12 w-full rounded-full bg-amber-500 py-4 text-lg font-bold text-white shadow-lg transition active:scale-[0.98]"
      >
        Verder →
      </button>
    </div>
  );
}
