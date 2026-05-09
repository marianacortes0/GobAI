import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  onRetry: () => void
}

export function EstadoError({ onRetry }: Props) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="rounded-full border border-red-500/40 bg-red-500/10 p-4 text-red-300">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-100">No pudimos cargar el grafo</h3>
        <p className="max-w-sm text-sm text-slate-400">
          Hubo un problema al consultar el endpoint de relaciones. Verifica tu conexión o reintenta.
        </p>
        <button
          onClick={onRetry}
          className="mt-1 inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reintentar
        </button>
      </div>
    </div>
  )
}
