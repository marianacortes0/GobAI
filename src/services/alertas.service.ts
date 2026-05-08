import api from './api'
import type { Alerta, AlertaStats } from '@/types/alerta.types'
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

function mapAlerta(c: BackendContract): Alerta {
  const riesgo = (c.categoria_riesgo === 'DESCONOCIDO' ? 'BAJO' : c.categoria_riesgo) as Alerta['riesgo']
  const severidadMap: Record<string, Alerta['severidad']> = {
    CRITICO: 'CRÍTICA',
    ALTO: 'ALTA',
    MEDIO: 'MEDIA',
    BAJO: 'BAJA',
  }
  return {
    id: c.id_contrato,
    tipo: c.modalidad ?? 'CONTRATACIÓN',
    severidad: severidadMap[c.categoria_riesgo] ?? 'MEDIA',
    estado: 'NUEVA',
    entidad: c.entidad_nombre ?? '',
    idProceso: c.id_contrato,
    senalDetectada: '',
    descripcion: c.nombre_proceso ?? '',
    fechaDeteccion: c.fecha_publicacion ?? '',
    departamento: '',
    scoreRiesgo: c.score_final ?? 0,
    riesgo,
    accionesSugeridas: [],
  }
}

export const alertasService = {
  async getAlertas(filters: Filters = {}): Promise<PaginatedResponse<Alerta>> {
    const params: Record<string, unknown> = {
      limit: filters.limit ?? 100,
      skip: ((filters.page ?? 1) - 1) * (filters.limit ?? 100),
    }
    if (filters.search) params.search = filters.search

    const { data } = await api.get<BackendContract[]>('/alertas/', { params })
    return {
      data: data.map(mapAlerta),
      total: data.length,
      page: filters.page ?? 1,
      limit: filters.limit ?? 100,
      totalPages: 1,
    }
  },

  async getAlerta(id: string): Promise<Alerta> {
    const { data } = await api.get<BackendContract>(`/alertas/${id}`)
    return mapAlerta(data)
  },

  async getStats(): Promise<AlertaStats> {
    const { data } = await api.get<AlertaStats>('/alertas/stats')
    return data
  },

  async marcarRevisada(id: string): Promise<void> {
    await api.patch(`/alertas/${id}/marcar-revisada`)
  },

  async actualizarEstado(id: string, estado: string): Promise<void> {
    await api.patch(`/alertas/${id}/estado`, null, { params: { estado } })
  },
}
