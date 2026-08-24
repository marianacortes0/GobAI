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
  descargas: number
  contratosAnalizados: number
  alertasIncluidas: number
  analizadoConIA: boolean
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

export interface IndicadorSenal {
  tipoFlag: string
  label: string
  count: number
  percentage: number
}

export interface AlertaPorEntidad {
  entidad: string
  count: number
}

export interface PuntoRiesgoSemanal {
  semana: string
  scorePromedio: number
}

export interface ReporteAnalitica {
  indicadoresSenales: IndicadorSenal[]
  alertasPorEntidad: AlertaPorEntidad[]
  evolucionRiesgo: PuntoRiesgoSemanal[]
}
