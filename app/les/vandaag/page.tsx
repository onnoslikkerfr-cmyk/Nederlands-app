"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LessonFlow from "@/components/LessonFlow";
import type { Les } from "@/data/lessen";

function dateKey(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Amsterdam" });
}

export default function LesVanVandaagPage() {
  const [les, setLes] = useState<Les | null>(null);
  const [fout, setFout] = useState(false);

  useEffect(() => {
    const key = "dn:les:" + dateKey();
    try {
      const cached = window.localStorage.getItem(key);
      if (cached) {
        setLes(JSON.parse(cached) as Les);
        return;
      }
    } catch {
      // cache kapot → gewoon opnieuw ophalen
    }
    fetch("/api/les-vandaag")
      .then((res) => {
        if (!res.ok) throw new Error("fout");
        return res.json();
      })
      .then((data: { les: Les }) => {
        window.localStorage.setItem(key, JSON.stringify(data.les));
        setLes(data.les);
      })
      .catch(() => setFout(true));
  }, []);

  if (fout) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col items-center px-5 pt-24 text-center">
        <div className="text-5xl">😕</div>
        <p className="mt-4 text-lg font-semibold text-stone-700">
          De les van vandaag kon niet worden opgehaald.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-full bg-amber-500 px-6 py-3 font-bold text-white shadow"
        >
          Terug naar begin
        </Link>
      </main>
    );
  }

  if (!les) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col items-center px-5 pt-24 text-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-amber-200 border-t-amber-500" />
        <p className="mt-6 text-lg font-semibold text-stone-700">
          Het nieuws van vandaag wordt omgezet in een les…
        </p>
      </main>
    );
  }

  return <LessonFlow les={les} />;
}
