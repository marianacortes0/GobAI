import { Suspense, lazy, useRef, useState } from 'react';
import type { Core } from 'cytoscape';
import { useGrafo } from '@/hooks/useGrafo';
import { useGrafoFiltros } from '@/hooks/useGrafoFiltros';
import FiltrosBar from './FiltrosBar';
import LeyendaNodos from './LeyendaNodos';
import MiniMapa from './MiniMapa';
import ControlesZoom from './ControlesZoom';
import PanelDetalle from './PanelDetalle';
import SkeletonGrafo from './SkeletonGrafo';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import type { NodoGrafo } from '@/types';

const GrafoCytoscape = lazy(() => import('./GrafoCytoscape'));

export default function MapaContainer() {
  const [filtros, setFiltros, resetFiltros] = useGrafoFiltros();
  const { data, isLoading, isError, refetch } = useGrafo(filtros);
  const [nodoSeleccionado, setNodoSeleccionado] = useState<NodoGrafo | null>(null);
  const cyRef = useRef<Core | null>(null);

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div className="px-6 pt-5">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-slate-100">Mapa de relaciones</h1>
          <span className="text-xs text-slate-500">
            Visualiza vínculos entre entidades, proveedores, contratos, personas y otros actores relevantes.
          </span>
        </div>
      </div>

      <FiltrosBar
        filtros={filtros}
        onChange={setFiltros}
        onReset={resetFiltros}
        cy={cyRef.current}
        statsAlertas={data?.stats?.alertas_alto_riesgo}
      />

      <div className="relative flex-1 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),transparent_60%)]" />

        {isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : isLoading || !data ? (
          <SkeletonGrafo />
        ) : data.nodos.length === 0 ? (
          <EmptyState />
        ) : (
          <Suspense fallback={<SkeletonGrafo />}>
            <GrafoCytoscape
              data={data}
              filtros={filtros}
              onNodeClick={setNodoSeleccionado}
              onCyReady={(cy) => {
                cyRef.current = cy;
              }}
            />
          </Suspense>
        )}

        <LeyendaNodos />
        <ControlesZoom cy={cyRef.current} />
        <MiniMapa />

        <PanelDetalle
          nodo={nodoSeleccionado}
          contexto={data}
          onClose={() => setNodoSeleccionado(null)}
        />
      </div>
    </div>
  );
}
