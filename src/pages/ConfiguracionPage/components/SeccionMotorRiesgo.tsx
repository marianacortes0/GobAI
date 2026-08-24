import type { ConfiguracionMotorRiesgo } from '@/types/configuracion.types'
import { Section, Slider } from './ui'

interface Props {
  motorRiesgo: ConfiguracionMotorRiesgo
  onChange: (patch: Partial<ConfiguracionMotorRiesgo>) => void
}

export function SeccionMotorRiesgo({ motorRiesgo, onChange }: Props) {
  const bandas = [
    { label: 'Riesgo bajo', from: 0, to: motorRiesgo.umbralRiesgoBajo, color: 'text-green-600 bg-green-50 border-green-200' },
    { label: 'Riesgo medio', from: motorRiesgo.umbralRiesgoBajo + 1, to: motorRiesgo.umbralRiesgoMedio, color: 'text-orange-600 bg-orange-50 border-orange-200' },
    { label: 'Riesgo alto', from: motorRiesgo.umbralRiesgoMedio + 1, to: motorRiesgo.umbralRiesgoAlto, color: 'text-red-600 bg-red-50 border-red-200' },
  ]

  return (
    <Section id="section-riesgo" title="3. Motor de riesgo">
      <div className="space-y-5">
        <Slider label="Modalidad sensible" unit="pts" value={motorRiesgo.pesoModalidadSensible} onChange={(v) => onChange({ pesoModalidadSensible: v })} />
        <Slider label="Baja competencia" unit="pts" value={motorRiesgo.pesoBajaCompetencia} onChange={(v) => onChange({ pesoBajaCompetencia: v })} />
        <Slider label="Justificación débil" unit="pts" value={motorRiesgo.pesoJustificacionDebil} onChange={(v) => onChange({ pesoJustificacionDebil: v })} />
        <Slider label="Valor cercano al precio base" unit="pts" value={motorRiesgo.pesoValorCercanoPrecioBase} onChange={(v) => onChange({ pesoValorCercanoPrecioBase: v })} />
        <Slider label="Descripción genérica" unit="pts" value={motorRiesgo.pesoDescripcionGenerica} onChange={(v) => onChange({ pesoDescripcionGenerica: v })} />
      </div>
      <div className="pt-3 border-t border-slate-100">
        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Umbrales de riesgo</p>
        <div className="grid grid-cols-3 gap-3">
          {bandas.map((b) => (
            <div key={b.label} className={`rounded-lg border p-3 text-center ${b.color}`}>
              <p className="text-xs font-semibold">{b.label}</p>
              <p className="text-sm font-bold mt-1">{b.from} - {b.to}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2">Ponderaciones auditables y ajustables.</p>
      </div>
    </Section>
  )
}
