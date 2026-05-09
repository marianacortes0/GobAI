export type TipoNodo =
  | 'entidad'
  | 'proveedor'
  | 'contrato'
  | 'persona'
  | 'consorcio'
  | 'sancion'
  | 'pep'

export type NivelRiesgoGrafo = 'alto' | 'medio' | 'bajo'

export type TipoArista =
  | 'adjudico'
  | 'ejecutado_por'
  | 'representante_legal'
  | 'miembro_de'
  | 'sancionado'
  | 'alerta'

export interface NodoMetadata {
  nit?: string
  cedula?: string
  ciudad?: string
  sector?: string
  rol?: string
  pep?: boolean
  valor?: number
  valor_total?: number
  monto?: number
  objeto?: string
  fecha?: string
  fuente?: string
  miembros?: string[]
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
    valor_total_contratos: number
    alertas_alto_riesgo: number
  }
}

export interface FiltrosGrafo {
  entidad_id: string
  tipo_relacion: 'todos' | TipoArista
  periodo: '3m' | '6m' | '12m' | '24m' | 'todos'
  nivel_riesgo: 'todos' | NivelRiesgoGrafo
}
