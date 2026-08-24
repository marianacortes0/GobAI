import { Network } from 'lucide-react'

interface Props {
  titulo?: string
  mensaje?: string
}

export function EstadoVacio({
  titulo = 'Sin resultados para los filtros aplicados',
  mensaje = 'Selecciona una entidad o ajusta los filtros de relación, periodo y nivel de riesgo para construir el grafo.',
}: Props) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="rounded-full border border-slate-700 bg-slate-800/60 p-4 text-slate-400">
          <Network className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-100">{titulo}</h3>
        <p className="max-w-sm text-sm text-slate-400">{mensaje}</p>
      </div>
    </div>
  )
}
