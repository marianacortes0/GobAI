import type { ElementDefinition } from 'cytoscape'
import type { GrafoData } from '@/types/relacion.types'

export function transformToCytoscape(data: GrafoData): ElementDefinition[] {
  const nodos: ElementDefinition[] = data.nodos.map((n) => ({
    group: 'nodes',
    data: {
      id: n.id,
      label: n.label,
      tipo: n.tipo,
      nivel_riesgo: n.nivel_riesgo,
      es_central: n.es_central ?? false,
      metadata: n.metadata ?? {},
    },
  }))
  const aristas: ElementDefinition[] = data.aristas.map((a) => ({
    group: 'edges',
    data: { id: a.id, source: a.source, target: a.target, tipo: a.tipo },
  }))
  return [...nodos, ...aristas]
}
