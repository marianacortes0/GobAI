import api from './api'
import type { DashboardStats, Contrato } from '@/types/contrato.types'
import type { Filters, PaginatedResponse } from '@/types/shared.types'

type BackendStats = {
  total_contratos: number
  presupuesto_total: number
  distribucion_riesgo: Array<{ category: string; count: number; percentage: number }>
  top_entidades_riesgo: Array<{ nombre: string; nit: string; valor_total: number; cantidad_contratos: number; score_promedio: number }>
}

type BackendContract = {
  id_contrato: string
  nombre_proceso: string | null
  entidad_nombre: string | null
  modalidad: string | null
  precio_base: number
  score_final: number
  categoria_riesgo: string
  fecha_publicacion: string | null
}

function mapContract(c: BackendContract): Contrato {
  return {
    id: c.id_contrato,
    idProceso: c.id_contrato,
    entidad: c.entidad_nombre ?? '',
    departamento: '',
    municipio: '',
    procedimiento: '',
    modalidad: c.modalidad ?? '',
    objeto: c.nombre_proceso ?? '',
    valorBase: c.precio_base ?? 0,
    estado: 'PUBLICADO',
    fechaPublicacion: c.fecha_publicacion ?? '',
    riesgo: c.categoria_riesgo as Contrato['riesgo'],
    scoreRiesgo: c.score_final ?? 0,
    senalesDetectadas: [],
    tieneAlertas: (c.score_final ?? 0) >= 50,
  }
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const { data } = await api.get<BackendStats>('/dashboard/stats')
    const dist = data.distribucion_riesgo ?? []
    const getCount = (cat: string) => dist.find(d => d.category === cat)?.count ?? 0
    return {
      totalContratos: data.total_contratos,
      riesgoAlto: getCount('ALTO'),
      riesgoMedio: getCount('MEDIO'),
      entidadesMonitoreadas: data.top_entidades_riesgo?.length ?? 0,
      distribucionRiesgo: {
        critico: getCount('CRÍTICO'),
        alto: getCount('ALTO'),
        medio: getCount('MEDIO'),
        bajo: getCount('BAJO'),
      },
    }
  },

  async getContratosPriorizados(filters: Filters = {}): Promise<PaginatedResponse<Contrato>> {
    const params: Record<string, unknown> = {
      limit: filters.limit ?? 10,
      skip: ((filters.page ?? 1) - 1) * (filters.limit ?? 10),
    }
    if (filters.search) params.search = filters.search
    if (filters.entidad) params.entidad = filters.entidad
    const { data } = await api.get<BackendContract[]>('/contracts/', { params })
    return {
      data: data.map(mapContract),
      total: data.length,
      page: filters.page ?? 1,
      limit: filters.limit ?? 10,
      totalPages: 1,
    }
  },
}
