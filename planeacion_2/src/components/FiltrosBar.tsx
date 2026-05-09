import { useState } from 'react';
import { AlertTriangle, Download, RotateCcw } from 'lucide-react';
import type { Core } from 'cytoscape';
import type { FiltrosGrafo } from '@/types';
import { exportarGrafo } from '@/lib/export-grafo';

interface Props {
  filtros: FiltrosGrafo;
  onChange: (parcial: Partial<FiltrosGrafo>) => void;
  onReset: () => void;
  cy: Core | null;
  statsAlertas?: number;
}

const ENTIDADES = [
  { id: 'ent-001', label: 'Termini S.A.S.' },
  { id: 'ent-002', label: 'Alcaldía de Bogotá' },
  { id: 'ent-003', label: 'Min. Transporte' },
];

const TIPOS_RELACION: Array<{ value: FiltrosGrafo['tipo_relacion']; label: string }> = [
  { value: 'todos', label: 'Todas las relaciones' },
  { value: 'adjudico', label: 'Adjudicación' },
  { value: 'ejecutado_por', label: 'Ejecutado por' },
  { value: 'representante_legal', label: 'Representante legal' },
  { value: 'miembro_de', label: 'Miembro de UT' },
  { value: 'sancionado', label: 'Sanción' },
  { value: 'alerta', label: 'Alertas PEP' },
];

const PERIODOS: Array<{ value: FiltrosGrafo['periodo']; label: string }> = [
  { value: '3m', label: 'Últimos 3 meses' },
  { value: '6m', label: 'Últimos 6 meses' },
  { value: '12m', label: 'Últimos 12 meses' },
  { value: '24m', label: 'Últimos 24 meses' },
  { value: 'todos', label: 'Todo el histórico' },
];

const RIESGOS: Array<{ value: FiltrosGrafo['nivel_riesgo']; label: string }> = [
  { value: 'todos', label: 'Todos los riesgos' },
  { value: 'alto', label: 'Riesgo alto' },
  { value: 'medio', label: 'Riesgo medio' },
  { value: 'bajo', label: 'Riesgo bajo' },
];

export default function FiltrosBar({ filtros, onChange, onReset, cy, statsAlertas }: Props) {
  const [exportando, setExportando] = useState<'png' | 'pdf' | null>(null);

  const handleExport = async (formato: 'png' | 'pdf') => {
    setExportando(formato);
    try {
      await exportarGrafo(cy, formato);
    } finally {
      setExportando(null);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 bg-slate-900/70 px-6 py-3 backdrop-blur">
      <Select
        label="Entidad"
        value={filtros.entidad_id}
        onChange={(v) => onChange({ entidad_id: v as string })}
        options={ENTIDADES.map((e) => ({ value: e.id, label: e.label }))}
      />
      <Select
        label="Relación"
        value={filtros.tipo_relacion}
        onChange={(v) => onChange({ tipo_relacion: v as FiltrosGrafo['tipo_relacion'] })}
        options={TIPOS_RELACION.map((t) => ({ value: t.value, label: t.label }))}
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
        className="ml-1 inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800/60 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
        title="Restablecer filtros"
      >
        <RotateCcw className="h-3.5 w-3.5" /> Reset
      </button>

      <div className="ml-auto flex items-center gap-2">
        {typeof statsAlertas === 'number' && statsAlertas > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full border border-red-500/40 bg-red-500/10 px-2 py-1 text-xs text-red-300">
            <AlertTriangle className="h-3.5 w-3.5" /> {statsAlertas} alertas alto riesgo
          </span>
        )}
        <button
          onClick={() => handleExport('png')}
          disabled={!cy || exportando !== null}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800 disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" /> {exportando === 'png' ? 'Generando…' : 'PNG'}
        </button>
        <button
          onClick={() => handleExport('pdf')}
          disabled={!cy || exportando !== null}
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500 disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" /> {exportando === 'pdf' ? 'Generando…' : 'Exportar grafo'}
        </button>
      </div>
    </div>
  );
}

interface SelectProps<V extends string> {
  label: string;
  value: V;
  onChange: (v: V) => void;
  options: Array<{ value: V; label: string }>;
}

function Select<V extends string>({ label, value, onChange, options }: SelectProps<V>) {
  return (
    <label className="flex items-center gap-1.5 text-xs text-slate-400">
      <span className="font-medium uppercase tracking-wide text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as V)}
        className="rounded-md border border-slate-700 bg-slate-800/70 px-2 py-1.5 text-xs text-slate-100 focus:border-blue-500 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
