import type { RiskLevel, ContractStatus } from './shared.types'

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
  riesgoAlto: number
  riesgoMedio: number
  entidadesMonitoreadas: number
  distribucionRiesgo: {
    critico: number
    alto: number
    medio: number
    bajo: number
  }
}
