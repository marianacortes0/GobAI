import api from './api'
import type { Reporte, ReporteCreate, ReporteStats } from '@/types/reporte.types'
import type { PaginatedResponse } from '@/types/shared.types'

type BackendReport = {
  id: number
  nombre: string
  tipo: string
  formato: string
  periodo: string
  cobertura?: string
  fecha_generacion: string
  usuario_nombre?: string
}

type BackendReportStats = {
  reportes_generados: number
  programados: number
  descargas: number
  riesgo_promedio: number
}

function mapReporte(r: BackendReport): Reporte {
  return {
    id: r.id,
    nombre: r.nombre,
    tipo: r.tipo as Reporte['tipo'],
    formato: r.formato as Reporte['formato'],
    periodo: r.periodo as Reporte['periodo'],
    cobertura: r.cobertura,
    fechaGeneracion: r.fecha_generacion,
    usuarioNombre: r.usuario_nombre,
  }
}

export const reportesService = {
  async getReportes(params: Record<string, unknown> = {}): Promise<PaginatedResponse<Reporte>> {
    const { data } = await api.get<BackendReport[]>('/reportes/', { params })
    return {
      data: data.map(mapReporte),
      total: data.length,
      page: 1,
      limit: 100,
      totalPages: 1,
    }
  },

  async getStats(): Promise<ReporteStats> {
    const { data } = await api.get<BackendReportStats>('/reportes/stats')
    return {
      generados: data.reportes_generados,
      programados: data.programados,
      descargas: data.descargas,
      riesgoPromedio: data.riesgo_promedio,
    }
  },

  async generarReporte(config: ReporteCreate): Promise<Reporte> {
    const { data } = await api.post<BackendReport>('/reportes/generar', config)
    return mapReporte(data)
  },

  async descargar(id: number): Promise<Blob> {
    const { data } = await api.get(`/reportes/descargar/${id}`, { responseType: 'blob' })
    return data
  },

  async descargarExcel(ids?: string[]): Promise<Blob> {
    const params = ids && ids.length > 0 ? { ids } : {}
    const { data } = await api.get('/reportes/excel', { params, responseType: 'blob' })
    return data
  },

  async descargarPDF(contractId: string): Promise<Blob> {
    const { data } = await api.get(`/reportes/pdf/${contractId}`, { responseType: 'blob' })
    return data
  },
}
