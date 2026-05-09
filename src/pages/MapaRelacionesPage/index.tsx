import { useCallback, useState } from 'react'
import type { Core } from 'cytoscape'
import { Info } from 'lucide-react'
import { useGrafo } from '@/hooks/useGrafo'
import { useGrafoFiltros } from '@/hooks/useGrafoFiltros'
import type { NodoGrafo } from '@/types/relacion.types'
import { FiltrosBar } from './components/FiltrosBar'
import { GrafoCytoscape } from './components/GrafoCytoscape'
import { LeyendaNodos } from './components/LeyendaNodos'
import { MiniMapa } from './components/MiniMapa'
import { ControlesZoom } from './components/ControlesZoom'
import { PanelDetalle } from './components/PanelDetalle'
import { SkeletonGrafo } from './components/SkeletonGrafo'
import { EstadoVacio } from './components/EstadoVacio'
import { EstadoError } from './components/EstadoError'

export function MapaRelacionesPage() {
  const { filtros, setFiltros, resetFiltros } = useGrafoFiltros()
  const { data, isLoading, isError, refetch } = useGrafo(filtros)
  const [nodoSeleccionado, setNodoSeleccionado] = useState<NodoGrafo | null>(null)
  const [cy, setCy] = useState<Core | null>(null)

  const handleCyReady = useCallback((instance: Core) => {
    setCy((prev) => (prev === instance ? prev : instance))
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-start gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mapa de relaciones</h1>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            Visualiza vínculos entre entidades, proveedores, contratos, personas y otros actores relevantes.
          </p>
        </div>
      </header>

      <FiltrosBar
        filtros={filtros}
        onChange={setFiltros}
        onReset={resetFiltros}
        cy={cy}
        alertasAlto={data?.stats?.alertas_alto_riesgo}
      />

      <div className="relative h-[calc(100vh-13rem)] overflow-hidden rounded-2xl border border-slate-600 bg-[#1E3251] shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(96,165,250,0.18),transparent_65%)]" />

        {isError ? (
          <EstadoError onRetry={() => refetch()} />
        ) : isLoading || !data ? (
          <SkeletonGrafo />
        ) : data.nodos.length === 0 ? (
          <EstadoVacio />
        ) : (
          <GrafoCytoscape data={data} onNodeClick={setNodoSeleccionado} onCyReady={handleCyReady} />
        )}

        <LeyendaNodos />
        <ControlesZoom cy={cy} />
        <MiniMapa />

        <PanelDetalle nodo={nodoSeleccionado} contexto={data} onClose={() => setNodoSeleccionado(null)} />
      </div>
    </div>
  )
}
