import type { RiskLevel, ContractStatus } from './shared.types'

export interface TopEntidad {
  nombre: string
  nit: string
  valor_total: number
  cantidad_contratos: number
  score_promedio: number
}

export interface ContractSummary {
  total: number
  adjudicados: number
  en_analisis: number
  riesgo_alto: number
}

export interface Contrato {
  id: string
  idProceso: string
  entidad: string
  departamento: string
  municipio: string
  procedimiento: string
  modalidad: string
  objeto: string
  valorBase: number
  valorAdjudicado?: number
  estado: ContractStatus
  fechaPublicacion: string
  fechaAdjudicacion?: string
  fechaInicio?: string
  fechaFin?: string
  proveedor?: string
  nit?: string
  riesgo: RiskLevel
  scoreRiesgo: number
  senalesDetectadas: string[]
  numSenales?: number
  tieneAlertas: boolean
  urlSecop?: string
}

export interface ContratoDetalle extends Contrato {
  justificacion?: string
  descripcionTecnica?: string
  estudiosPrevistos?: string
  evaluacion?: {
    score: number
    riesgo: RiskLevel
    resumen: string
    hallazgos: string[]
    recomendaciones: string[]
  }
}

export interface DashboardStats {
  totalContratos: number
  presupuestoTotal: number
  riesgoAlto: number
  riesgoMedio: number
  entidadesMonitoreadas: number
  scorePromedio: number
  ultimaActualizacion: string | null
  distribucionRiesgo: {
    critico: number
    alto: number
    medio: number
    bajo: number
  }
  topEntidadesRiesgo: TopEntidad[]
  topEntidadesPresupuesto: TopEntidad[]
}
