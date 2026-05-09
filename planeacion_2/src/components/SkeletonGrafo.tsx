export default function SkeletonGrafo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-8 gap-2 p-12 opacity-30">
        {Array.from({ length: 32 }).map((_, i) => (
          <span
            key={i}
            className="shimmer rounded-full"
            style={{
              gridColumn: `${(i * 3) % 12 + 1} / span 1`,
              gridRow: `${(i * 2) % 8 + 1} / span 1`,
              height: 20 + (i % 4) * 10,
              width: 20 + (i % 4) * 10,
            }}
          />
        ))}
      </div>
      <div className="z-10 flex flex-col items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-4 text-sm text-slate-300 backdrop-blur">
        <div className="h-4 w-32 rounded shimmer" />
        <div className="h-3 w-24 rounded shimmer" />
        <p className="mt-2 text-xs text-slate-500">Construyendo grafo de relaciones…</p>
      </div>
    </div>
  );
}
