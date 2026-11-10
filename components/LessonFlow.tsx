"use client";

import { useEffect, useState } from "react";
import StepsBar from "@/components/StepsBar";
import StepLuisteren from "@/components/StepLuisteren";
import StepLezen from "@/components/StepLezen";
import StepOefenen, { type OefenAntwoorden } from "@/components/StepOefenen";
import StepVerhaaltje from "@/components/StepVerhaaltje";
import StepKlaar from "@/components/StepKlaar";
import { stopSpeaking } from "@/lib/tts";
import { markLessonDone } from "@/lib/storage";
import type { Les } from "@/data/lessen";

export default function LessonFlow({ les }: { les: Les }) {
  const [stap, setStap] = useState(0);
  const [antwoorden, setAntwoorden] = useState<OefenAntwoorden>({
    vervoeg: [],
    invullen: [],
  });
  const [verhaal, setVerhaal] = useState("");

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  useEffect(() => {
    if (stap === 4) {
      markLessonDone(les.id, {
        vervoeg: antwoorden.vervoeg,
        invullen: antwoorden.invullen,
        verhaal,
      });
    }
  }, [stap, les.id, antwoorden, verhaal]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-[480px] px-5 pt-6 pb-10">
      <StepsBar huidige={stap} afgerond={stap} />

      <div className="mt-4">
        {stap === 0 && (
          <StepLuisteren les={les} onVerder={() => setStap(1)} />
        )}
        {stap === 1 && <StepLezen les={les} onVerder={() => setStap(2)} />}
        {stap === 2 && (
          <StepOefenen
            les={les}
            onVerder={(a) => {
              setAntwoorden(a);
              setStap(3);
            }}
          />
        )}
        {stap === 3 && (
          <StepVerhaaltje
            les={les}
            onVerder={(tekst) => {
              setVerhaal(tekst);
              setStap(4);
            }}
          />
        )}
        {stap === 4 && (
          <StepKlaar les={les} antwoorden={antwoorden} verhaal={verhaal} />
        )}
      </div>
    </main>
  );
}
