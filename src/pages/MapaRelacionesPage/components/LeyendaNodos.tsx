import { NODO_COLORS } from '@/utils/constants'

const ITEMS = [
  { color: NODO_COLORS.entidad, label: 'Entidad central' },
  { color: NODO_COLORS.proveedor, label: 'Proveedor' },
  { color: NODO_COLORS.persona, label: 'Persona' },
  { color: NODO_COLORS.sancion, label: 'Sanción / Multa' },
]

export function LeyendaNodos() {
  return (
    <div className="absolute bottom-4 left-4 z-20 max-w-[220px] rounded-xl border border-slate-700 bg-slate-900/85 p-3 backdrop-blur">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Tipos de nodo</p>
      <ul className="grid grid-cols-1 gap-1.5">
        {ITEMS.map((it) => (
          <li key={it.label} className="flex items-center gap-2 text-xs text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: it.color }} />
            {it.label}
          </li>
        ))}
      </ul>
      <p className="mt-3 border-t border-slate-700 pt-2 text-[10px] text-slate-500">
        — — — representante / socio · ─── adjudicación · <span className="text-red-400">───</span> sanción
      </p>
    </div>
  )
}
