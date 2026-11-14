import type { Les } from "@/data/lessen";

// Simpele servercache per dag (werkt binnen dezelfde server-instantie;
// de client bewaart de les additionally in localStorage).
const g = globalThis as unknown as { __dnLesCache?: Map<string, Les> };
if (!g.__dnLesCache) g.__dnLesCache = new Map<string, Les>();
export const lessonsCache = g.__dnLesCache;

export function todayKey(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Amsterdam" });
}
