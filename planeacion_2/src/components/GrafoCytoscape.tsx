import { useEffect, useMemo, useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape, { Core } from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';
// @ts-expect-error tipos no publicados
import navigator from 'cytoscape-navigator';
import { transformToCytoscape } from '@/lib/transform-data';
import { layoutConfig, stylesheet } from '@/lib/cytoscape-config';
import type { FiltrosGrafo, GrafoData, NodoGrafo } from '@/types';

let registrado = false;
function registrarExtensiones() {
  if (registrado) return;
  cytoscape.use(coseBilkent);
  try {
    cytoscape.use(navigator);
  } catch {
    // navigator es opcional
  }
  registrado = true;
}

interface Props {
  data: GrafoData;
  filtros: FiltrosGrafo;
  onNodeClick: (nodo: NodoGrafo) => void;
  onCyReady?: (cy: Core) => void;
}

export default function GrafoCytoscape({ data, filtros, onNodeClick, onCyReady }: Props) {
  registrarExtensiones();

  const cyRef = useRef<Core | null>(null);
  const elements = useMemo(() => transformToCytoscape(data, filtros), [data, filtros]);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.elements().remove();
    cy.add(elements);
    cy.layout(layoutConfig).run();
  }, [elements]);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    const handleTap = (evt: cytoscape.EventObject) => {
      const node = evt.target;
      const data = node.data();
      onNodeClick({
        id: data.id,
        label: data.label,
        tipo: data.tipo,
        nivel_riesgo: data.nivel_riesgo,
        es_central: data.es_central,
        metadata: data.metadata,
      });

      cy.elements().addClass('faded');
      const conectados = node.closedNeighborhood();
      conectados.removeClass('faded');
    };

    const handleBgTap = (evt: cytoscape.EventObject) => {
      if (evt.target === cy) {
        cy.elements().removeClass('faded');
      }
    };

    cy.on('tap', 'node', handleTap);
    cy.on('tap', handleBgTap);

    return () => {
      cy.off('tap', 'node', handleTap);
      cy.off('tap', handleBgTap);
    };
  }, [onNodeClick]);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    const tieneNavigator = typeof (cy as unknown as { navigator?: unknown }).navigator === 'function';
    if (!tieneNavigator) return;
    const container = document.getElementById('minimapa-container');
    if (!container) return;
    container.innerHTML = '';
    try {
      const nav = (cy as unknown as { navigator: (opts: object) => { destroy: () => void } }).navigator({
        container,
        viewLiveFramerate: 0,
        thumbnailEventFramerate: 30,
        dblClickDelay: 200,
      });
      return () => nav?.destroy?.();
    } catch {
      return;
    }
  }, []);

  return (
    <CytoscapeComponent
      elements={elements}
      stylesheet={stylesheet as never}
      layout={layoutConfig as never}
      style={{ width: '100%', height: '100%' }}
      wheelSensitivity={0.2}
      minZoom={0.2}
      maxZoom={3}
      cy={(cy: Core) => {
        cyRef.current = cy;
        onCyReady?.(cy);
      }}
    />
  );
}
