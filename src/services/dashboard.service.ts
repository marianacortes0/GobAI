import api from './api'
import type { DashboardStats, Contrato } from '@/types/contrato.types'
import type { Filters, PaginatedResponse } from '@/types/shared.types'

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const { data } = await api.get<{ data: DashboardStats }>('/dashboard/stats')
    return data.data
  },

  async getContratosPriorizados(filters: Filters = {}): Promise<PaginatedResponse<Contrato>> {
    const { data } = await api.get<PaginatedResponse<Contrato>>('/dashboard/contratos-priorizados', { params: filters })
    return data
  },
}
