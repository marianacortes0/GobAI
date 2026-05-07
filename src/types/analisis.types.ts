import type { RiskLevel } from './shared.types'

export interface FactorPonderado {
  nombre: string
  peso: number
  valor: number
  color: string
}

export interface Hallazgo {
  id: string
  titulo: string
  descripcion: string
  severidad: 'ALTA' | 'MEDIA' | 'BAJA'
  tipo: string
}

export interface EvidenciaTextual {
  campo: string
  texto: string
  relevancia: 'ALTA' | 'MEDIA' | 'BAJA'
}

export interface PasoTrazabilidad {
  numero: number
  titulo: string
  descripcion: string
  estado: 'COMPLETADO' | 'EN_PROCESO' | 'PENDIENTE'
}

export interface Analisis {
  id: string
  contratoId: string
  idProceso: string
  entidad: string
  modelo: string
  modoAnalisis: string
  scoreTotal: number
  senalesCriticas: number
  hallazgosIA: number
  confianza: number
  riesgo: RiskLevel
  resumenEjecutivo: string
  factoresPonderados: FactorPonderado[]
  trazabilidad: PasoTrazabilidad[]
  hallazgos: Hallazgo[]
  evidencias: EvidenciaTextual[]
  recomendaciones: string[]
  fechaAnalisis: string
  entradasAnalizadas: string[]
}
