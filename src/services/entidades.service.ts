import api from './api'
import type { PaginatedResponse } from '@/types/shared.types'

export interface Entidad {
  nit: string
  nombre: string
  departamento?: string
  ciudad?: string
  contratos_count: number
}

type BackendEntity = {
  nit: string
  nombre: string
  departamento: string | null
  ciudad: string | null
  contratos_count: number
}

export const entidadesService = {
  async getEntidades(params: {
    skip?: number
    limit?: number
    search?: string
  } = {}): Promise<PaginatedResponse<Entidad>> {
    const { data } = await api.get<BackendEntity[]>('/entities/', { params })
    return {
      data: data.map(e => ({
        nit: e.nit,
        nombre: e.nombre,
        departamento: e.departamento ?? undefined,
        ciudad: e.ciudad ?? undefined,
        contratos_count: e.contratos_count,
      })),
      total: data.length,
      page: 1,
      limit: params.limit ?? 100,
      totalPages: 1,
    }
  },
}
