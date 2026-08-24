import api from './api'
import type { AristaGrafo, FiltrosGrafo, GrafoData, NodoGrafo } from '@/types/relacion.types'

type BackendGrafoNode = {
  id: string
  label: string
  tipo: string
  es_central: boolean
  nivel_riesgo: string | null
  metadata: Record<string, unknown>
}

type BackendGrafoEdge = {
  source: string
  target: string
  tipo: string
  label?: string | null
  weight?: number
}

type BackendGrafoResponse = {
  nodes: BackendGrafoNode[]
  edges: BackendGrafoEdge[]
  stats: Record<string, unknown>
}

function mapNodo(n: BackendGrafoNode): NodoGrafo {
  return {
    id: n.id,
    label: n.label,
    tipo: n.tipo as NodoGrafo['tipo'],
    nivel_riesgo: (n.nivel_riesgo ?? undefined) as NodoGrafo['nivel_riesgo'],
    es_central: n.es_central,
    metadata: n.metadata as NodoGrafo['metadata'],
  }
}

function mapArista(e: BackendGrafoEdge, i: number): AristaGrafo {
  return {
    id: `${e.source}__${e.target}__${i}`,
    source: e.source,
    target: e.target,
    tipo: e.tipo as AristaGrafo['tipo'],
  }
}

export const relacionesService = {
  async getGrafo(filtros: FiltrosGrafo): Promise<GrafoData> {
    const { data } = await api.get<BackendGrafoResponse>('/relaciones/grafo', {
      params: {
        entidad_id: filtros.entidad_id,
        tipo_relacion: filtros.tipo_relacion,
        periodo: filtros.periodo,
        nivel_riesgo: filtros.nivel_riesgo,
        profundidad: 2,
      },
    })

    const nodos = data.nodes.map(mapNodo)
    const aristas = data.edges.map(mapArista)
    const central = nodos.find((n) => n.es_central)

    return {
      entidad_central: central
        ? { id: central.id, nombre: central.label, tipo: central.tipo, nit: central.metadata?.nit ?? '' }
        : { id: '', nombre: '', tipo: '', nit: '' },
      nodos,
      aristas,
      stats: {
        total_nodos: nodos.length,
        total_aristas: aristas.length,
        alertas_alto_riesgo: nodos.filter((n) => n.nivel_riesgo === 'alto').length,
      },
    }
  },
}
