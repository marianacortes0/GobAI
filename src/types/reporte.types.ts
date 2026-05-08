export type ReportType = 'CONTRATACION' | 'ENTIDAD' | 'RIESGO'
export type ReportFormat = 'PDF' | 'XLSX'
export type ReportPeriod = 'SEMANA' | 'MES' | 'TRIMESTRE'

export interface Reporte {
  id: number
  nombre: string
  tipo: ReportType
  formato: ReportFormat
  periodo: ReportPeriod
  cobertura?: string
  fechaGeneracion: string
  usuarioNombre?: string
}

export interface ReporteCreate {
  nombre: string
  tipo: ReportType
  formato: ReportFormat
  periodo: ReportPeriod
  cobertura?: string
}

export interface ReporteStats {
  generados: number
  programados: number
  descargas: number
  riesgoPromedio: number
}
