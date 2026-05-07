import api from './api'
import type { Contrato, ContratoDetalle } from '@/types/contrato.types'
import type { Filters, PaginatedResponse } from '@/types/shared.types'

export const contratosService = {
  async getContratos(filters: Filters = {}): Promise<PaginatedResponse<Contrato>> {
    const { data } = await api.get<PaginatedResponse<Contrato>>('/contratos', { params: filters })
    return data
  },

  async getContrato(id: string): Promise<ContratoDetalle> {
    const { data } = await api.get<{ data: ContratoDetalle }>(`/contratos/${id}`)
    return data.data
  },
}
