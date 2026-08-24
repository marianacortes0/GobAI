import { RefreshCw, Loader2 } from 'lucide-react'
import { useRespaldo, useRealizarRespaldo } from '@/hooks/useConfiguracion'
import { useToast } from '@/hooks/useToast'
import { Section, FieldLabel } from './ui'
import { formatTimestamp } from '@/utils/formatters'

const MOCK_RESPALDO = { ultimoRespaldo: '24/05/2025 02:00 a. m.', frecuencia: 'Diaria' }

export function SeccionRespaldo() {
  const toast = useToast()
  const { data } = useRespaldo()
  const { mutate: realizarRespaldo, isPending } = useRealizarRespaldo()
  const respaldo = data ?? MOCK_RESPALDO

  function handleRespaldo() {
    realizarRespaldo(undefined, {
      onSuccess: () => toast.success('Respaldo realizado correctamente'),
      onError: () => toast.error('No se pudo realizar el respaldo'),
    })
  }

  return (
    <Section id="section-respaldo" title="6. Respaldo y recuperación">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Último respaldo</FieldLabel>
          <p className="text-sm text-slate-700">{formatTimestamp(respaldo.ultimoRespaldo)}</p>
        </div>
        <div>
          <FieldLabel>Frecuencia</FieldLabel>
          <p className="text-sm text-slate-700">{respaldo.frecuencia}</p>
        </div>
      </div>
      <button onClick={handleRespaldo} disabled={isPending} className="flex items-center gap-2 px-3 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 disabled:opacity-60">
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Realizar respaldo ahora
      </button>
    </Section>
  )
}
