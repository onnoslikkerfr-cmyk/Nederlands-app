"use client";

export default function HelpSheet({
  titel,
  onClose,
  children,
}: {
  titel: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="animate-fade-in fixed inset-0 z-20 bg-black/40"
      onClick={onClose}
    >
      <div
        className="animate-sheet-up absolute inset-x-0 bottom-0 mx-auto w-full max-w-[480px] rounded-t-3xl bg-white p-6 shadow-2xl"
        style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-stone-200" />
        <h2 className="text-2xl font-extrabold text-amber-600">{titel}</h2>
        <div className="mt-3">{children}</div>
        <button
          onClick={onClose}
          className="mt-5 w-full rounded-full bg-amber-500 py-3.5 text-lg font-bold text-white shadow transition active:scale-[0.98]"
        >
          Sluiten
        </button>
      </div>
    </div>
  );
}
