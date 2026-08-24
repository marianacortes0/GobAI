export type TipoNodo = 'entidad' | 'proveedor' | 'persona' | 'sancion'

export type NivelRiesgoGrafo = 'alto' | 'medio' | 'bajo'

export type TipoArista = 'contrato' | 'representante_legal' | 'socio' | 'sancion'

export type TipoRelacionFiltro = 'todos' | 'contrato' | 'rep_legal' | 'socio' | 'sancion'

export interface NodoMetadata {
  nit?: string
  cedula?: string
  ciudad?: string
  departamento?: string
  sector?: string
  rol?: string
  es_pep?: boolean
  valor?: number
  valor_total?: number
  total_contratos?: number
  monto?: number
  objeto?: string
  fecha?: string
  fuente?: string
}

export interface NodoGrafo {
  id: string
  label: string
  tipo: TipoNodo
  nivel_riesgo?: NivelRiesgoGrafo
  es_central?: boolean
  metadata?: NodoMetadata
}

export interface AristaGrafo {
  id: string
  source: string
  target: string
  tipo: TipoArista
}

export interface GrafoData {
  entidad_central: { id: string; nombre: string; tipo: string; nit: string }
  nodos: NodoGrafo[]
  aristas: AristaGrafo[]
  stats: {
    total_nodos: number
    total_aristas: number
    alertas_alto_riesgo: number
  }
}

export interface FiltrosGrafo {
  entidad_id: string
  tipo_relacion: TipoRelacionFiltro
  periodo: '1m' | '3m' | '6m' | '12m' | 'todos'
  nivel_riesgo: 'todos' | NivelRiesgoGrafo
}
