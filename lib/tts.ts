let voicesReady = false;
let currentAudio: HTMLAudioElement | null = null;

function pickDutchVoice(): SpeechSynthesisVoice | undefined {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return undefined;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === "nl-NL") ||
    voices.find((v) => v.lang.toLowerCase().startsWith("nl")) ||
    undefined
  );
}

export function ensureVoices(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || voicesReady) return;
  voicesReady = true;
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

export function speak(text: string, rate: number, onEnd?: () => void): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "nl-NL";
  utterance.rate = rate;
  const voice = pickDutchVoice();
  if (voice) utterance.voice = voice;
  if (onEnd) utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
}

export async function speakWithAI(
  text: string,
  rate: number,
  onEnd?: () => void
): Promise<boolean> {
  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, rate }),
    });
    if (!res.ok) return false;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    currentAudio = audio;
    audio.onended = () => {
      URL.revokeObjectURL(url);
      if (currentAudio === audio) currentAudio = null;
      onEnd?.();
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      if (currentAudio === audio) currentAudio = null;
      onEnd?.();
    };
    await audio.play();
    return true;
  } catch {
    return false;
  }
}

export function stopSpeaking(): void {
  if (typeof window === "undefined") return;
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

export function isSpeaking(): boolean {
  if (typeof window === "undefined") return false;
  if (currentAudio && !currentAudio.paused) return true;
  if ("speechSynthesis" in window) return window.speechSynthesis.speaking;
  return false;
}
