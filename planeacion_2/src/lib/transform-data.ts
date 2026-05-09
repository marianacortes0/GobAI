import type { ElementDefinition } from 'cytoscape';
import type { FiltrosGrafo, GrafoData } from '@/types';

export function transformToCytoscape(data: GrafoData, filtros?: FiltrosGrafo): ElementDefinition[] {
  const nodos = data.nodos.filter((n) => {
    if (!filtros || filtros.nivel_riesgo === 'todos') return true;
    if (n.es_central) return true;
    return n.nivel_riesgo === filtros.nivel_riesgo;
  });

  const idsValidos = new Set(nodos.map((n) => n.id));

  const aristas = data.aristas.filter((a) => {
    if (!idsValidos.has(a.source) || !idsValidos.has(a.target)) return false;
    if (!filtros || filtros.tipo_relacion === 'todos') return true;
    return a.tipo === filtros.tipo_relacion;
  });

  const nodeElements: ElementDefinition[] = nodos.map((n) => ({
    group: 'nodes',
    data: {
      id: n.id,
      label: n.label,
      tipo: n.tipo,
      nivel_riesgo: n.nivel_riesgo,
      es_central: n.es_central ?? false,
      metadata: n.metadata ?? {},
    },
  }));

  const edgeElements: ElementDefinition[] = aristas.map((a) => ({
    group: 'edges',
    data: { id: a.id, source: a.source, target: a.target, tipo: a.tipo },
  }));

  return [...nodeElements, ...edgeElements];
}

export function aplicaFiltrosCliente(data: GrafoData, filtros: FiltrosGrafo): GrafoData {
  const elementos = transformToCytoscape(data, filtros);
  const nodos = elementos
    .filter((e) => e.group === 'nodes')
    .map((e) => ({
      id: e.data.id as string,
      label: e.data.label as string,
      tipo: e.data.tipo,
      nivel_riesgo: e.data.nivel_riesgo,
      es_central: e.data.es_central,
      metadata: e.data.metadata,
    })) as GrafoData['nodos'];
  const aristas = elementos
    .filter((e) => e.group === 'edges')
    .map((e) => ({
      id: e.data.id as string,
      source: e.data.source as string,
      target: e.data.target as string,
      tipo: e.data.tipo,
    })) as GrafoData['aristas'];
  return { ...data, nodos, aristas };
}
