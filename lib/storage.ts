const KEY = "dn:progress:v1";

export type LessonProgress = {
  done: boolean;
  date: string;
  vervoeg: string[];
  invullen: string[];
  verhaal: string;
};

export type Progress = Record<string, LessonProgress>;

export function loadProgress(): Progress {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "{}") as Progress;
  } catch {
    return {};
  }
}

export function saveProgress(progress: Progress): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(progress));
}

export function markLessonDone(
  id: string,
  data: Omit<LessonProgress, "done" | "date">
): void {
  const progress = loadProgress();
  progress[id] = { ...data, done: true, date: new Date().toISOString().slice(0, 10) };
  saveProgress(progress);
}

export function firstUnfinishedLessonId(lessonIds: string[]): string {
  const progress = loadProgress();
  const open = lessonIds.find((id) => !progress[id]?.done);
  return open ?? lessonIds[lessonIds.length - 1];
}
