import type { RiskLevel } from './shared.types'

export type ReportType = 'EJECUTIVO' | 'DETALLADO' | 'ALERTAS' | 'CONTRATACION' | 'IA'
export type ReportFormat = 'PDF' | 'XLSX' | 'CSV'
export type ReportPeriod = 'SEMANA' | 'MES' | 'TRIMESTRE' | 'ANUAL' | 'PERSONALIZADO'

export interface Reporte {
  id: string
  tipo: ReportType
  formato: ReportFormat
  periodo: ReportPeriod
  departamento?: string
  fechaGeneracion: string
  totalContratos: number
  totalAlertas: number
  totalAnalisis: number
  scoreRiesgoPromedio: number
  riesgo: RiskLevel
}

export interface ReporteDetalle extends Reporte {
  resumenPeriodo: string
  indicadoresClave: Array<{ nombre: string; valor: number; maximo: number; color: string }>
  distribucionRiesgo: { critico: number; alto: number; medio: number; bajo: number }
  hallazgosPriorizados: Array<{ titulo: string; descripcion: string; prioridad: number }>
  alertasPorEntidad: Array<{ entidad: string; cantidad: number }>
  evolucionRiesgo: Array<{ semana: string; score: number }>
  insights: Array<{ titulo: string; descripcion: string; tipo: string }>
  historialExportacion: Array<{ fecha: string; formato: ReportFormat; usuario: string }>
  conclusion: string
}

export interface ReporteStats {
  generados: number
  programados: number
  descargas: number
  riesgoPromedio: number
}
