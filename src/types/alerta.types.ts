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
  flags: string[]
  accionesSugeridas: string[]
  distribucionRiesgo?: {
    critico: number
    alto: number
    medio: number
    bajo: number
  }
}

export interface AlertaStats {
  total: number
  revisadas: number
  pendientes: number
  riesgo_critico: number
}
