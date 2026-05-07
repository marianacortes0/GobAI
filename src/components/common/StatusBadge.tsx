import { cn } from '@/utils/helpers'

type Status = 'PUBLICADO' | 'ADJUDICADO' | 'EN_EJECUCION' | 'TERMINADO' | 'CANCELADO' | 'NUEVA' | 'EN_REVISION' | 'EN_SEGUIMIENTO' | 'RESUELTA'

const STATUS_STYLES: Record<string, string> = {
  PUBLICADO: 'bg-blue-50 text-blue-700 border-blue-100',
  ADJUDICADO: 'bg-green-50 text-green-700 border-green-100',
  EN_EJECUCION: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  TERMINADO: 'bg-slate-50 text-slate-600 border-slate-200',
  CANCELADO: 'bg-red-50 text-red-700 border-red-100',
  NUEVA: 'bg-red-50 text-red-700 border-red-100',
  EN_REVISION: 'bg-orange-50 text-orange-700 border-orange-100',
  EN_SEGUIMIENTO: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  RESUELTA: 'bg-green-50 text-green-700 border-green-100',
}

const STATUS_LABELS: Record<string, string> = {
  PUBLICADO: 'Publicado',
  ADJUDICADO: 'Adjudicado',
  EN_EJECUCION: 'En ejecución',
  TERMINADO: 'Terminado',
  CANCELADO: 'Cancelado',
  NUEVA: 'Nueva',
  EN_REVISION: 'En revisión',
  EN_SEGUIMIENTO: 'En seguimiento',
  RESUELTA: 'Resuelta',
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', STATUS_STYLES[status] ?? 'bg-slate-50 text-slate-600 border-slate-200')}>
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}
