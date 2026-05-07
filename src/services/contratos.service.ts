import api from './api'
import type { Contrato, ContratoDetalle } from '@/types/contrato.types'
import type { Filters, PaginatedResponse } from '@/types/shared.types'

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

type BackendContractDetail = {
  id_contrato: string
  id_del_proceso: string
  nombre_proceso: string | null
  descripcion: string | null
  estado: string | null
  modalidad: string | null
  precio_base: number
  fecha_publicacion: string | null
  entidad: { nit: string; nombre: string }
  riesgo: { score_final: number; categoria_riesgo: string; evidencia: string } | null
  flags: Array<{ tipo_flag: string; valor: boolean }>
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

export const contratosService = {
  async getContratos(filters: Filters = {}): Promise<PaginatedResponse<Contrato>> {
    const params: Record<string, unknown> = {
      limit: filters.limit ?? 100,
      skip: ((filters.page ?? 1) - 1) * (filters.limit ?? 100),
    }
    if (filters.search) params.search = filters.search
    if (filters.entidad) params.entidad = filters.entidad
    if (filters.riesgo) params.riesgo = filters.riesgo
    if (filters.modalidad) params.modalidad = filters.modalidad

    const { data } = await api.get<BackendContract[]>('/contracts/', { params })
    return {
      data: data.map(mapContract),
      total: data.length,
      page: filters.page ?? 1,
      limit: filters.limit ?? 100,
      totalPages: 1,
    }
  },

  async getContrato(id: string): Promise<ContratoDetalle> {
    const { data } = await api.get<BackendContractDetail>(`/contracts/${id}`)
    return {
      id: data.id_contrato,
      idProceso: data.id_del_proceso ?? data.id_contrato,
      entidad: data.entidad?.nombre ?? '',
      departamento: '',
      municipio: '',
      procedimiento: '',
      modalidad: data.modalidad ?? '',
      objeto: data.nombre_proceso ?? '',
      valorBase: data.precio_base ?? 0,
      estado: 'PUBLICADO',
      fechaPublicacion: data.fecha_publicacion ?? '',
      riesgo: data.riesgo?.categoria_riesgo as ContratoDetalle['riesgo'],
      scoreRiesgo: data.riesgo?.score_final ?? 0,
      senalesDetectadas: (data.flags ?? []).filter(f => f.valor).map(f => f.tipo_flag),
      tieneAlertas: (data.riesgo?.score_final ?? 0) >= 50,
      descripcionTecnica: data.descripcion ?? undefined,
      evaluacion: data.riesgo ? {
        score: data.riesgo.score_final,
        riesgo: data.riesgo.categoria_riesgo as ContratoDetalle['riesgo'],
        resumen: data.riesgo.evidencia,
        hallazgos: [],
        recomendaciones: [],
      } : undefined,
    }
  },
}
