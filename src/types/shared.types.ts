export type RiskLevel = 'CRÍTICO' | 'ALTO' | 'MEDIO' | 'BAJO'
export type Severity = 'CRÍTICA' | 'ALTA' | 'MEDIA' | 'BAJA'
export type ContractStatus = 'PUBLICADO' | 'ADJUDICADO' | 'EN_EJECUCION' | 'TERMINADO' | 'CANCELADO'
export type AlertStatus = 'NUEVA' | 'EN_REVISION' | 'EN_SEGUIMIENTO' | 'RESUELTA'
export type UserRole = 'ADMIN' | 'AUDITOR' | 'ANALISTA' | 'READONLY'

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface SelectOption {
  value: string
  label: string
}

export interface DateRange {
  from: Date | null
  to: Date | null
}

export interface Filters {
  departamento?: string
  entidad?: string
  modalidad?: string
  estado?: string
  riesgo?: RiskLevel
  fechaDesde?: string
  fechaHasta?: string
  valorMin?: number
  valorMax?: number
  search?: string
  page?: number
  limit?: number
}
