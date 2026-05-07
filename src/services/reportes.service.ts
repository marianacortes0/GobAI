import api from './api'
import type { Reporte, ReporteDetalle, ReporteStats } from '@/types/reporte.types'
import type { PaginatedResponse } from '@/types/shared.types'

export const reportesService = {
  async getReportes(params = {}): Promise<PaginatedResponse<Reporte>> {
    const { data } = await api.get<PaginatedResponse<Reporte>>('/reportes', { params })
    return data
  },

  async getReporte(id: string): Promise<ReporteDetalle> {
    const { data } = await api.get<{ data: ReporteDetalle }>(`/reportes/${id}`)
    return data.data
  },

  async getStats(): Promise<ReporteStats> {
    const { data } = await api.get<{ data: ReporteStats }>('/reportes/stats')
    return data.data
  },

  async generarReporte(config: object): Promise<Reporte> {
    const { data } = await api.post<{ data: Reporte }>('/reportes/generar', config)
    return data.data
  },

  async descargar(id: string, formato: string): Promise<Blob> {
    const { data } = await api.get(`/reportes/${id}/descargar`, { params: { formato }, responseType: 'blob' })
    return data
  },
}
