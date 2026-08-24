import api from './api'
import type { Alerta, AlertaStats } from '@/types/alerta.types'
import type { Filters, PaginatedResponse, Severity, RiskLevel, AlertStatus } from '@/types/shared.types'

type BackendAlertaItem = {
  id_contrato: string
  nombre_proceso: string | null
  entidad_nombre: string | null
  departamento: string | null
  modalidad: string | null
  precio_base: number
  score_final: number
  categoria_riesgo: string
  fecha_publicacion: string | null
  estado: AlertStatus
  flags: string[]
}

type BackendAlertaStats = {
  total: number
  revisadas: number
  pendientes: number
  riesgo_critico: number
}

export const FLAG_LABELS: Record<string, string> = {
  modalidad_sensible: 'Modalidad sensible',
  baja_competencia: 'Baja competencia',
  proveedor_nuevo: 'Proveedor nuevo',
  proveedor_recurrente: 'Proveedor recurrente',
  valor_cercano_precio_base: 'Valor cercano al precio base',
  sancion_previa: 'Sanción previa',
  coincidencia_pep: 'Coincidencia PEP',
  conflicto_interes: 'Conflicto de interés',
  oferente_unico: 'Oferente único',
  descripcion_generica: 'Descripción genérica',
  justificacion_debil: 'Justificación débil',
  hhi_alto: 'Alta concentración (HHI)',
}

export const FLAG_ACCIONES: Record<string, string> = {
  modalidad_sensible: 'Revisar el soporte técnico de la modalidad de contratación',
  baja_competencia: 'Validar el historial de participación de proveedores',
  proveedor_nuevo: 'Verificar antecedentes y capacidad del proveedor',
  proveedor_recurrente: 'Comparar con procesos similares de este proveedor',
  valor_cercano_precio_base: 'Analizar la justificación del valor ofertado',
  sancion_previa: 'Revisar el historial de sanciones del proveedor',
  coincidencia_pep: 'Escalar a control interno por posible conflicto de interés',
  conflicto_interes: 'Escalar a control interno por posible conflicto de interés',
  oferente_unico: 'Validar la pluralidad de oferentes en el proceso',
  descripcion_generica: 'Solicitar mayor detalle del objeto contractual',
  justificacion_debil: 'Solicitar soporte adicional de la justificación',
  hhi_alto: 'Revisar la concentración de contratos en la entidad',
}

export function flagLabel(flag: string): string {
  return FLAG_LABELS[flag] ?? flag.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
}

export function accionesSugeridas(flags: string[]): string[] {
  const acciones = flags.map((f) => FLAG_ACCIONES[f]).filter((a): a is string => !!a)
  return acciones.length > 0 ? acciones : ['Revisar el proceso manualmente para confirmar el nivel de riesgo']
}

export function severidadFromScore(score: number): Severity {
  if (score >= 90) return 'CRÍTICA'
  if (score >= 70) return 'ALTA'
  if (score >= 50) return 'MEDIA'
  return 'BAJA'
}

export function riesgoFromScore(score: number, categoria: string): RiskLevel {
  if (score >= 90) return 'CRÍTICO'
  const c = (categoria ?? '').toUpperCase()
  if (c === 'ALTO') return 'ALTO'
  if (c === 'MEDIO') return 'MEDIO'
  if (c === 'BAJO' || c === 'DESCONOCIDO') return 'BAJO'
  return 'MEDIO'
}

function mapAlerta(c: BackendAlertaItem): Alerta {
  const score = c.score_final ?? 0
  const flags = c.flags ?? []
  return {
    id: c.id_contrato,
    tipo: c.modalidad ?? 'Sin modalidad',
    severidad: severidadFromScore(score),
    estado: c.estado ?? 'NUEVA',
    entidad: c.entidad_nombre ?? '',
    idProceso: c.id_contrato,
    senalDetectada: flags.length > 0 ? flags.map(flagLabel).join(' · ') : `Score de riesgo ${Math.round(score)}/100`,
    descripcion: c.nombre_proceso ?? 'Sin descripción del proceso.',
    fechaDeteccion: c.fecha_publicacion ?? '',
    departamento: c.departamento ?? '',
    scoreRiesgo: Math.round(score),
    riesgo: riesgoFromScore(score, c.categoria_riesgo),
    flags,
    accionesSugeridas: accionesSugeridas(flags),
  }
}

export const alertasService = {
  async getAlertas(filters: Filters = {}): Promise<PaginatedResponse<Alerta>> {
    const params: Record<string, unknown> = {
      limit: filters.limit ?? 10,
      skip: ((filters.page ?? 1) - 1) * (filters.limit ?? 10),
    }
    if (filters.search) params.search = filters.search
    if (filters.departamento) params.departamento = filters.departamento
    if (filters.estado) params.estado = filters.estado
    if (filters.riesgo === 'CRÍTICO') params.score_min = 90
    if (filters.fechaDesde) params.fecha_desde = filters.fechaDesde
    if (filters.fechaHasta) params.fecha_hasta = filters.fechaHasta

    const response = await api.get<BackendAlertaItem[]>('/alertas/', { params })
    const total = Number(response.headers['x-total-count'] ?? response.data.length)
    const limit = filters.limit ?? 10
    return {
      data: response.data.map(mapAlerta),
      total,
      page: filters.page ?? 1,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    }
  },

  async getAlerta(id: string): Promise<Alerta> {
    const { data } = await api.get<BackendAlertaItem>(`/alertas/${id}`)
    return mapAlerta(data)
  },

  async getStats(): Promise<AlertaStats> {
    const { data } = await api.get<BackendAlertaStats>('/alertas/stats')
    return data
  },

  async marcarRevisada(id: string): Promise<void> {
    await api.patch(`/alertas/${id}/marcar-revisada`)
  },

  async actualizarEstado(id: string, estado: AlertStatus): Promise<void> {
    await api.patch(`/alertas/${id}/estado`, null, { params: { estado } })
  },
}
