"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LessonFlow from "@/components/LessonFlow";
import type { Les } from "@/data/lessen";

export const LES_KEY = "dn:onderwerp-les";

export default function LesOnderwerpPage() {
  const [les, setLes] = useState<Les | null>(null);

  useEffect(() => {
    try {
      const cached = window.localStorage.getItem(LES_KEY);
      if (cached) setLes(JSON.parse(cached) as Les);
    } catch {
      // geen cached les
    }
  }, []);

  if (!les) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col items-center px-5 pt-24 text-center">
        <div className="text-5xl">🎯</div>
        <p className="mt-4 text-lg font-semibold text-stone-700">
          Nog geen eigen onderwerp-les gemaakt.
        </p>
        <Link
          href="/onderwerp"
          className="mt-6 rounded-full bg-amber-500 px-6 py-3 font-bold text-white shadow"
        >
          Kies een onderwerp
        </Link>
      </main>
    );
  }

  return <LessonFlow les={les} />;
}
