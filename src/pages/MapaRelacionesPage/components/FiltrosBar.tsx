import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, Download, RotateCcw, Search } from 'lucide-react'
import type { Core } from 'cytoscape'
import { cn } from '@/utils/helpers'
import { exportarGrafo } from '@/utils/export-grafo'
import { useDebounce } from '@/hooks/useDebounce'
import { entidadesService } from '@/services/entidades.service'
import type { FiltrosGrafo } from '@/types/relacion.types'

interface Props {
  filtros: FiltrosGrafo
  onChange: (parcial: Partial<FiltrosGrafo>) => void
  onReset: () => void
  cy: Core | null
  alertasAlto?: number
  entidadNombre?: string
}

const TIPOS: Array<{ value: FiltrosGrafo['tipo_relacion']; label: string }> = [
  { value: 'todos', label: 'Todas las relaciones' },
  { value: 'contrato', label: 'Adjudicación de contrato' },
  { value: 'rep_legal', label: 'Representante legal' },
  { value: 'socio', label: 'Socio' },
  { value: 'sancion', label: 'Sanción' },
]

const PERIODOS: Array<{ value: FiltrosGrafo['periodo']; label: string }> = [
  { value: '1m', label: 'Último mes' },
  { value: '3m', label: 'Últimos 3 meses' },
  { value: '6m', label: 'Últimos 6 meses' },
  { value: '12m', label: 'Últimos 12 meses' },
  { value: 'todos', label: 'Todo el histórico' },
]

const RIESGOS: Array<{ value: FiltrosGrafo['nivel_riesgo']; label: string }> = [
  { value: 'todos', label: 'Todos los riesgos' },
  { value: 'alto', label: 'Riesgo alto' },
  { value: 'medio', label: 'Riesgo medio' },
  { value: 'bajo', label: 'Riesgo bajo' },
]

export function FiltrosBar({ filtros, onChange, onReset, cy, alertasAlto, entidadNombre }: Props) {
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
      <EntidadPicker
        key={entidadNombre ?? 'none'}
        entidadNombre={entidadNombre}
        onSelect={(nit) => onChange({ entidad_id: nit })}
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

interface EntidadPickerProps {
  entidadNombre?: string
  onSelect: (nit: string, nombre: string) => void
}

function EntidadPicker({ entidadNombre, onSelect }: EntidadPickerProps) {
  const [query, setQuery] = useState(entidadNombre ?? '')
  const [open, setOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 350)

  const { data, isFetching } = useQuery({
    queryKey: ['entidades-grafo-picker', debouncedQuery],
    queryFn: () => entidadesService.getEntidades({ search: debouncedQuery }),
    enabled: open && debouncedQuery.trim().length >= 2,
  })

  const resultados = data?.data.slice(0, 20) ?? []

  return (
    <div className="relative">
      <label className="flex items-center gap-1.5 text-xs">
        <span className="font-medium uppercase tracking-wide text-slate-400">Entidad</span>
        <span className="relative">
          <Search className="pointer-events-none absolute left-2 top-1/2 w-3.5 h-3.5 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder="Buscar entidad por nombre o NIT..."
            className="w-64 rounded-md border border-slate-200 bg-white py-1.5 pl-7 pr-2 text-xs text-slate-700 hover:border-slate-300 focus:border-blue-500 focus:outline-none"
          />
        </span>
      </label>
      {open && debouncedQuery.trim().length >= 2 && (
        <ul className="absolute left-0 z-40 mt-1 max-h-64 w-80 overflow-y-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg">
          {isFetching && <li className="px-3 py-2 text-xs text-slate-400">Buscando…</li>}
          {!isFetching && resultados.length === 0 && (
            <li className="px-3 py-2 text-xs text-slate-400">Sin coincidencias</li>
          )}
          {resultados.map((e) => (
            <li key={e.nit}>
              <button
                type="button"
                onMouseDown={(evt) => evt.preventDefault()}
                onClick={() => {
                  onSelect(e.nit, e.nombre)
                  setQuery(e.nombre)
                  setOpen(false)
                }}
                className="block w-full px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-blue-50"
              >
                <span className="font-medium">{e.nombre}</span>
                {e.departamento && <span className="ml-1.5 text-slate-400">· {e.departamento}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
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
