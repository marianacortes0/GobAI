import type { Severity, AlertStatus, RiskLevel } from './shared.types'

export interface Alerta {
  id: string
  tipo: string
  severidad: Severity
  estado: AlertStatus
  entidad: string
  idProceso: string
  proveedor?: string
  senalDetectada: string
  descripcion: string
  fechaDeteccion: string
  fechaActualizacion?: string
  departamento: string
  municipio?: string
  scoreRiesgo: number
  riesgo: RiskLevel
  accionesSugeridas: string[]
  distribucionRiesgo?: {
    critico: number
    alto: number
    medio: number
    bajo: number
  }
}

export interface AlertaStats {
  activas: number
  criticas: number
  enSeguimiento: number
  resueltas: number
}
