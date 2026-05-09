import api from './api'
import type { Alerta, AlertaStats } from '@/types/alerta.types'
import type { Filters, PaginatedResponse, Severity, RiskLevel } from '@/types/shared.types'

type BackendContract = {
  id_contrato: string
  id_del_proceso?: string | null
  nombre_proceso: string | null
  entidad_nombre: string | null
  modalidad: string | null
  precio_base: number
  score_final: number
  categoria_riesgo: string
  fecha_publicacion: string | null
}

function severidadFromScore(score: number): Severity {
  if (score >= 90) return 'CRÍTICA'
  if (score >= 70) return 'ALTA'
  if (score >= 50) return 'MEDIA'
  return 'BAJA'
}

function riesgoFromScore(score: number, categoria: string): RiskLevel {
  if (score >= 90) return 'CRÍTICO'
  const c = (categoria ?? '').toUpperCase()
  if (c === 'ALTO') return 'ALTO'
  if (c === 'MEDIO') return 'MEDIO'
  if (c === 'BAJO' || c === 'DESCONOCIDO') return 'BAJO'
  return 'MEDIO'
}

function mapAlerta(c: BackendContract): Alerta {
  const score = c.score_final ?? 0
  return {
    id: c.id_contrato,
    tipo: c.modalidad ?? 'Sin modalidad',
    severidad: severidadFromScore(score),
    estado: 'NUEVA',
    entidad: c.entidad_nombre ?? '',
    idProceso: c.id_del_proceso ?? c.id_contrato,
    senalDetectada: `Score de riesgo ${Math.round(score)}/100 · ${(c.categoria_riesgo ?? '').toUpperCase() || 'SIN CATEGORÍA'}`,
    descripcion: c.nombre_proceso ?? 'Sin descripción del proceso.',
    fechaDeteccion: c.fecha_publicacion ?? '',
    departamento: '',
    scoreRiesgo: Math.round(score),
    riesgo: riesgoFromScore(score, c.categoria_riesgo),
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
    const { data } = await api.get<{ data: AlertaStats } | AlertaStats>('/alertas/stats')
    const inner = (data as { data?: AlertaStats }).data ?? (data as AlertaStats)
    return {
      total: inner.total ?? 0,
      revisadas: inner.revisadas ?? 0,
      pendientes: inner.pendientes ?? 0,
      riesgo_critico: inner.riesgo_critico ?? 0,
    }
  },

  async marcarRevisada(id: string): Promise<void> {
    await api.patch(`/alertas/${id}/marcar-revisada`)
  },

  async actualizarEstado(id: string, estado: string): Promise<void> {
    await api.patch(`/alertas/${id}/estado`, null, { params: { estado } })
  },
}
