import type { ConfiguracionIA } from '@/types/configuracion.types'
import { cn } from '@/utils/helpers'
import { Section, Toggle, FieldLabel, inputClass, selectClass } from './ui'

interface Props {
  ia: ConfiguracionIA
  onChange: (patch: Partial<ConfiguracionIA>) => void
}

const ENTRADAS_DISPONIBLES = ['Descripción', 'Justificación', 'Modalidad', 'Proveedores', 'Valor base']

export function SeccionIA({ ia, onChange }: Props) {
  function toggleEntrada(entrada: string) {
    const activa = ia.entradasActivas.includes(entrada)
    onChange({
      entradasActivas: activa
        ? ia.entradasActivas.filter((e) => e !== entrada)
        : [...ia.entradasActivas, entrada],
    })
  }

  return (
    <Section id="section-ia" title="4. IA y análisis">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Modelo principal</FieldLabel>
          <select value={ia.modeloPrincipal} onChange={(e) => onChange({ modeloPrincipal: e.target.value })} className={selectClass}>
            <option value="LLM + motor de reglas">LLM + motor de reglas</option>
            <option value="Solo motor de reglas">Solo motor de reglas</option>
            <option value="Solo LLM">Solo LLM</option>
          </select>
        </div>
        <div>
          <FieldLabel>Temperatura</FieldLabel>
          <input type="number" step="0.1" min={0} max={1} value={ia.temperatura} onChange={(e) => onChange({ temperatura: Number(e.target.value) })} className={inputClass} />
        </div>
        <div>
          <FieldLabel>Máximo de contratos por lote</FieldLabel>
          <input type="number" min={1} value={ia.maxContratosPorLote} onChange={(e) => onChange({ maxContratosPorLote: Number(e.target.value) })} className={inputClass} />
        </div>
      </div>
      <div className="pt-2 border-t border-slate-100">
        <FieldLabel>Entradas activas para análisis</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {ENTRADAS_DISPONIBLES.map((entrada) => {
            const activa = ia.entradasActivas.includes(entrada)
            return (
              <button
                key={entrada}
                onClick={() => toggleEntrada(entrada)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                  activa ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                )}
              >
                {entrada}
              </button>
            )
          })}
        </div>
      </div>
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <Toggle label="Análisis textual" checked={ia.analisisTextual} onChange={(v) => onChange({ analisisTextual: v })} />
        <Toggle label="Evidencia textual" checked={ia.evidenciaTextual} onChange={(v) => onChange({ evidenciaTextual: v })} />
        <Toggle label="Resúmenes automáticos" checked={ia.resumenesAutomaticos} onChange={(v) => onChange({ resumenesAutomaticos: v })} />
      </div>
    </Section>
  )
}
