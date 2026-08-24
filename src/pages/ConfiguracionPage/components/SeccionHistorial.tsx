import { History } from 'lucide-react'
import { useHistorialCambios } from '@/hooks/useConfiguracion'
import { useToast } from '@/hooks/useToast'
import { Section, FieldLabel } from './ui'
import { formatTimestamp } from '@/utils/formatters'

const MOCK_HISTORIAL = { cambiosRegistrados: 156, ultimoCambio: 'Hoy, 08:30 a. m.' }

export function SeccionHistorial() {
  const toast = useToast()
  const { data } = useHistorialCambios()
  const historial = data ?? MOCK_HISTORIAL

  return (
    <Section id="section-historial" title="7. Historial de cambios">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Cambios registrados</FieldLabel>
          <p className="text-sm text-slate-700">{historial.cambiosRegistrados}</p>
        </div>
        <div>
          <FieldLabel>Último cambio</FieldLabel>
          <p className="text-sm text-slate-700">{formatTimestamp(historial.ultimoCambio)}</p>
        </div>
      </div>
      <button onClick={() => toast.info('El historial completo estará disponible próximamente')} className="flex items-center gap-2 px-3 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50">
        <History className="w-4 h-4" /> Ver historial completo
      </button>
    </Section>
  )
}
