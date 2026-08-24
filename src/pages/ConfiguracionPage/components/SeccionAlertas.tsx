import { Bell } from 'lucide-react'
import type { ConfiguracionAlertas } from '@/types/configuracion.types'
import { Section, Toggle, FieldLabel, inputClass, selectClass } from './ui'

interface Props {
  alertas: ConfiguracionAlertas
  onChange: (patch: Partial<ConfiguracionAlertas>) => void
  alertasActivas: number
}

export function SeccionAlertas({ alertas, onChange, alertasActivas }: Props) {
  return (
    <Section id="section-alertas" title="5. Alertas y notificaciones">
      <div className="space-y-3">
        <Toggle label="Alertas críticas" checked={alertas.alertasCriticas} onChange={(v) => onChange({ alertasCriticas: v })} />
        <Toggle label="Riesgo alto" checked={alertas.riesgoAlto} onChange={(v) => onChange({ riesgoAlto: v })} />
        <Toggle label="Resumen diario" checked={alertas.resumenDiario} onChange={(v) => onChange({ resumenDiario: v })} />
        <Toggle label="Resumen semanal" checked={alertas.resumenSemanal} onChange={(v) => onChange({ resumenSemanal: v })} />
      </div>
      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
        <div>
          <FieldLabel>Canal principal</FieldLabel>
          <select value={alertas.canalPrincipal} onChange={(e) => onChange({ canalPrincipal: e.target.value })} className={selectClass}>
            <option value="Correo electrónico">Correo electrónico</option>
            <option value="SMS">SMS</option>
            <option value="Webhook">Webhook</option>
          </select>
        </div>
        <div>
          <FieldLabel>Destinatarios</FieldLabel>
          <input type="email" value={alertas.destinatarios} onChange={(e) => onChange({ destinatarios: e.target.value })} className={inputClass} />
        </div>
      </div>
      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
        <Bell className="w-4 h-4 text-red-600" />
        <p className="text-sm font-medium text-red-700">{alertasActivas} alertas activas</p>
      </div>
    </Section>
  )
}
