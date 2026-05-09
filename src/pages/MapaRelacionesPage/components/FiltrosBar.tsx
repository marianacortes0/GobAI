import { useState } from 'react'
import { AlertTriangle, Download, RotateCcw } from 'lucide-react'
import type { Core } from 'cytoscape'
import { cn } from '@/utils/helpers'
import { exportarGrafo } from '@/utils/export-grafo'
import { ENTIDADES_DISPONIBLES } from '@/services/relaciones.service'
import type { FiltrosGrafo } from '@/types/relacion.types'

interface Props {
  filtros: FiltrosGrafo
  onChange: (parcial: Partial<FiltrosGrafo>) => void
  onReset: () => void
  cy: Core | null
  alertasAlto?: number
}

const TIPOS: Array<{ value: FiltrosGrafo['tipo_relacion']; label: string }> = [
  { value: 'todos', label: 'Todas las relaciones' },
  { value: 'adjudico', label: 'Adjudicación' },
  { value: 'ejecutado_por', label: 'Ejecutado por' },
  { value: 'representante_legal', label: 'Representante legal' },
  { value: 'miembro_de', label: 'Miembro de UT' },
  { value: 'sancionado', label: 'Sanción' },
  { value: 'alerta', label: 'Alertas PEP' },
]

const PERIODOS: Array<{ value: FiltrosGrafo['periodo']; label: string }> = [
  { value: '3m', label: 'Últimos 3 meses' },
  { value: '6m', label: 'Últimos 6 meses' },
  { value: '12m', label: 'Últimos 12 meses' },
  { value: '24m', label: 'Últimos 24 meses' },
  { value: 'todos', label: 'Todo el histórico' },
]

const RIESGOS: Array<{ value: FiltrosGrafo['nivel_riesgo']; label: string }> = [
  { value: 'todos', label: 'Todos los riesgos' },
  { value: 'alto', label: 'Riesgo alto' },
  { value: 'medio', label: 'Riesgo medio' },
  { value: 'bajo', label: 'Riesgo bajo' },
]

export function FiltrosBar({ filtros, onChange, onReset, cy, alertasAlto }: Props) {
  const [exportando, setExportando] = useState<'png' | 'pdf' | null>(null)

  async function handleExport(formato: 'png' | 'pdf') {
    setExportando(formato)
    try {
      await exportarGrafo(cy, formato)
    } finally {
      setExportando(null)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-3 flex flex-wrap items-center gap-2">
      <Select
        label="Entidad"
        value={filtros.entidad_id}
        onChange={(v) => onChange({ entidad_id: v })}
        options={ENTIDADES_DISPONIBLES.map((e) => ({ value: e.id, label: e.label }))}
      />
      <Select
        label="Relación"
        value={filtros.tipo_relacion}
        onChange={(v) => onChange({ tipo_relacion: v as FiltrosGrafo['tipo_relacion'] })}
        options={TIPOS.map((t) => ({ value: t.value, label: t.label }))}
      />
      <Select
        label="Periodo"
        value={filtros.periodo}
        onChange={(v) => onChange({ periodo: v as FiltrosGrafo['periodo'] })}
        options={PERIODOS.map((p) => ({ value: p.value, label: p.label }))}
      />
      <Select
        label="Riesgo"
        value={filtros.nivel_riesgo}
        onChange={(v) => onChange({ nivel_riesgo: v as FiltrosGrafo['nivel_riesgo'] })}
        options={RIESGOS.map((r) => ({ value: r.value, label: r.label }))}
      />

      <button
        onClick={onReset}
        className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
        title="Restablecer filtros"
      >
        <RotateCcw className="w-3.5 h-3.5" /> Reset
      </button>

      <div className="ml-auto flex items-center gap-2">
        {typeof alertasAlto === 'number' && alertasAlto > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
            <AlertTriangle className="w-3.5 h-3.5" /> {alertasAlto} alertas alto riesgo
          </span>
        )}
        <button
          onClick={() => handleExport('png')}
          disabled={!cy || exportando !== null}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" /> {exportando === 'png' ? 'Generando…' : 'PNG'}
        </button>
        <button
          onClick={() => handleExport('pdf')}
          disabled={!cy || exportando !== null}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-white',
            'bg-blue-600 hover:bg-blue-700 disabled:opacity-50',
          )}
        >
          <Download className="w-3.5 h-3.5" /> {exportando === 'pdf' ? 'Generando…' : 'Exportar grafo'}
        </button>
      </div>
    </div>
  )
}

interface SelectProps {
  label: string
  value: string
  onChange: (v: string) => void
  options: Array<{ value: string; label: string }>
}

function Select({ label, value, onChange, options }: SelectProps) {
  return (
    <label className="flex items-center gap-1.5 text-xs">
      <span className="font-medium uppercase tracking-wide text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 hover:border-slate-300 focus:border-blue-500 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
