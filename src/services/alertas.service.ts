import api from './api'
import type { Alerta, AlertaStats } from '@/types/alerta.types'
import type { Filters, PaginatedResponse } from '@/types/shared.types'

export const alertasService = {
  async getAlertas(filters: Filters = {}): Promise<PaginatedResponse<Alerta>> {
    const { data } = await api.get<PaginatedResponse<Alerta>>('/alertas', { params: filters })
    return data
  },

  async getAlerta(id: string): Promise<Alerta> {
    const { data } = await api.get<{ data: Alerta }>(`/alertas/${id}`)
    return data.data
  },

  async getStats(): Promise<AlertaStats> {
    const { data } = await api.get<{ data: AlertaStats }>('/alertas/stats')
    return data.data
  },

  async marcarRevisada(id: string): Promise<void> {
    await api.patch(`/alertas/${id}/marcar-revisada`)
  },

  async actualizarEstado(id: string, estado: string): Promise<void> {
    await api.patch(`/alertas/${id}/estado`, { estado })
  },
}
