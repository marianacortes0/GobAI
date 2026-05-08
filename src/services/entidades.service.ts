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

const PAGE_SIZE = 100

function mapEntity(e: BackendEntity): Entidad {
  return {
    nit: e.nit,
    nombre: e.nombre,
    departamento: e.departamento && e.departamento !== 'None' ? e.departamento : undefined,
    ciudad: e.ciudad && e.ciudad !== 'None' ? e.ciudad : undefined,
    contratos_count: e.contratos_count,
  }
}

export const entidadesService = {
  async getEntidades(params: {
    search?: string
  } = {}): Promise<PaginatedResponse<Entidad>> {
    const all: Entidad[] = []
    let skip = 0

    while (true) {
      const { data } = await api.get<BackendEntity[]>('/entities/', {
        params: { skip, limit: PAGE_SIZE, ...(params.search ? { search: params.search } : {}) },
      })
      all.push(...data.map(mapEntity))
      if (data.length < PAGE_SIZE) break
      skip += PAGE_SIZE
    }

    return {
      data: all,
      total: all.length,
      page: 1,
      limit: all.length,
      totalPages: 1,
    }
  },
}
