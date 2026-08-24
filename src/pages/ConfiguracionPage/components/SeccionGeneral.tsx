import type { ConfiguracionGeneral } from '@/types/configuracion.types'
import { Section, Toggle, FieldLabel, inputClass, selectClass } from './ui'

interface Props {
  general: ConfiguracionGeneral
  onChange: (patch: Partial<ConfiguracionGeneral>) => void
}

export function SeccionGeneral({ general, onChange }: Props) {
  return (
    <Section id="section-general" title="1. Configuración general">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Nombre de la instancia</FieldLabel>
          <input value={general.nombreSistema} onChange={(e) => onChange({ nombreSistema: e.target.value })} className={inputClass} />
        </div>
        <div>
          <FieldLabel>Ambiente</FieldLabel>
          <select value={general.ambiente} onChange={(e) => onChange({ ambiente: e.target.value as ConfiguracionGeneral['ambiente'] })} className={selectClass}>
            <option value="PRODUCCION">Producción</option>
            <option value="STAGING">Staging</option>
            <option value="DESARROLLO">Desarrollo</option>
          </select>
        </div>
        <div>
          <FieldLabel>Idioma</FieldLabel>
          <select value={general.idioma} onChange={(e) => onChange({ idioma: e.target.value })} className={selectClass}>
            <option>Español</option>
            <option>English</option>
          </select>
        </div>
        <div>
          <FieldLabel>Zona horaria</FieldLabel>
          <select value={general.zona_horaria} onChange={(e) => onChange({ zona_horaria: e.target.value })} className={selectClass}>
            <option>America/Bogota</option>
          </select>
        </div>
      </div>
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <Toggle
          label="Modo explicable activado"
          info="Muestra la justificación del modelo de IA junto a cada hallazgo"
          checked={general.modoExplicableActivado}
          onChange={(v) => onChange({ modoExplicableActivado: v })}
        />
        <Toggle
          label="Registro de auditoría"
          info="Registra cada cambio de configuración con fecha y hora"
          checked={general.registroAuditoria}
          onChange={(v) => onChange({ registroAuditoria: v })}
        />
      </div>
    </Section>
  )
}
