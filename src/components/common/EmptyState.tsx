import { SearchX } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
}

export function EmptyState({ title = 'Sin resultados', description = 'No se encontraron datos con los filtros aplicados.' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <SearchX className="w-12 h-12 text-slate-300 mb-4" />
      <h3 className="text-base font-semibold text-slate-600 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-xs">{description}</p>
    </div>
  )
}
