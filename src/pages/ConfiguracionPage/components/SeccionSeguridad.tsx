import { ShieldCheck, Loader2 } from 'lucide-react'
import type { ConfiguracionSeguridad } from '@/types/configuracion.types'
import { useSeguridad, useEjecutarVerificacion } from '@/hooks/useConfiguracion'
import { useToast } from '@/hooks/useToast'
import { Section, Pill, FieldLabel } from './ui'
import { formatTimestamp } from '@/utils/formatters'

const MOCK_SEGURIDAD: ConfiguracionSeguridad = { estado: 'CORRECTA', ultimaVerificacion: 'Hoy, 06:45 a. m.' }

const ESTADO_COLOR: Record<ConfiguracionSeguridad['estado'], 'green' | 'orange' | 'red'> = {
  CORRECTA: 'green',
  ALERTA: 'orange',
  CRITICA: 'red',
}

const ESTADO_LABEL: Record<ConfiguracionSeguridad['estado'], string> = {
  CORRECTA: 'Correcta',
  ALERTA: 'Alerta',
  CRITICA: 'Crítica',
}

export function SeccionSeguridad() {
  const toast = useToast()
  const { data } = useSeguridad()
  const { mutate: verificar, isPending } = useEjecutarVerificacion()
  const seguridad = data ?? MOCK_SEGURIDAD

  function handleVerificar() {
    verificar(undefined, {
      onSuccess: () => toast.success('Verificación de seguridad completada'),
      onError: () => toast.error('No se pudo ejecutar la verificación'),
    })
  }

  return (
    <Section id="section-seguridad" title="8. Seguridad">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Estado de seguridad</FieldLabel>
          <Pill color={ESTADO_COLOR[seguridad.estado]}>{ESTADO_LABEL[seguridad.estado]}</Pill>
        </div>
        <div>
          <FieldLabel>Última verificación</FieldLabel>
          <p className="text-sm text-slate-700">{formatTimestamp(seguridad.ultimaVerificacion)}</p>
        </div>
      </div>
      <button onClick={handleVerificar} disabled={isPending} className="flex items-center gap-2 px-3 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 disabled:opacity-60">
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />} Ejecutar verificación
      </button>
    </Section>
  )
}
