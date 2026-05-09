export function MiniMapa() {
  return (
    <div className="absolute bottom-4 right-4 z-20 h-32 w-44 overflow-hidden rounded-xl border border-slate-700 bg-slate-900/80 backdrop-blur">
      <div className="flex items-center justify-between border-b border-slate-700 bg-slate-900/70 px-2 py-1 text-[10px] uppercase tracking-wider text-slate-400">
        <span>Mini-mapa</span>
      </div>
      <div id="mapa-relaciones-minimapa" className="relative h-[calc(100%-22px)] w-full" />
    </div>
  )
}
