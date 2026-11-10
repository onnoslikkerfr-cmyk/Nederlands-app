const STAPPEN = ["Luisteren", "Lezen", "Oefenen", "Verhaaltje", "Klaar"];
const ICONS = ["🔊", "📖", "✏️", "✍️", "🎉"];

export default function StepsBar({
  huidige,
  afgerond,
}: {
  huidige: number;
  afgerond: number;
}) {
  return (
    <ol className="flex items-center justify-between gap-1 rounded-2xl bg-white/80 px-3 py-3 shadow-sm">
      {STAPPEN.map((naam, i) => {
        const done = i < afgerond;
        const actief = i === huidige;
        return (
          <li key={naam} className="flex flex-1 flex-col items-center gap-0.5">
            <span
              className={
                "flex h-8 w-8 items-center justify-center rounded-full text-sm " +
                (done
                  ? "bg-green-500 text-white"
                  : actief
                    ? "bg-amber-500 text-white"
                    : "bg-stone-200 text-stone-400")
              }
            >
              {done ? "✓" : ICONS[i]}
            </span>
            <span
              className={
                "text-[10px] font-semibold " +
                (actief ? "text-amber-700" : done ? "text-green-600" : "text-stone-400")
              }
            >
              {naam}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
