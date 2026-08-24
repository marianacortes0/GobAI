import api from './api'
import type { Reporte, ReporteCreate, ReporteStats, ReporteAnalitica } from '@/types/reporte.types'
import type { PaginatedResponse } from '@/types/shared.types'

type BackendReport = {
  id: number
  nombre: string
  tipo: string
  formato: string
  periodo: string
  cobertura?: string
  fecha_generacion: string
  usuario_nombre?: string
  descargas: number
  contratos_analizados: number
  alertas_incluidas: number
  analizado_con_ia: boolean
}

type BackendReportStats = {
  reportes_generados: number
  programados: number
  descargas: number
  riesgo_promedio: number
}

type BackendAnalitica = {
  indicadores_senales: { tipo_flag: string; label: string; count: number; percentage: number }[]
  alertas_por_entidad: { entidad: string; count: number }[]
  evolucion_riesgo: { semana: string; score_promedio: number }[]
}

function mapReporte(r: BackendReport): Reporte {
  return {
    id: r.id,
    nombre: r.nombre,
    tipo: r.tipo as Reporte['tipo'],
    formato: r.formato as Reporte['formato'],
    periodo: r.periodo as Reporte['periodo'],
    cobertura: r.cobertura,
    fechaGeneracion: r.fecha_generacion,
    usuarioNombre: r.usuario_nombre,
    descargas: r.descargas ?? 0,
    contratosAnalizados: r.contratos_analizados ?? 0,
    alertasIncluidas: r.alertas_incluidas ?? 0,
    analizadoConIA: r.analizado_con_ia ?? false,
  }
}

function mapAnalitica(d: BackendAnalitica): ReporteAnalitica {
  return {
    indicadoresSenales: d.indicadores_senales.map((i) => ({ tipoFlag: i.tipo_flag, label: i.label, count: i.count, percentage: i.percentage })),
    alertasPorEntidad: d.alertas_por_entidad.map((a) => ({ entidad: a.entidad, count: a.count })),
    evolucionRiesgo: d.evolucion_riesgo.map((e) => ({ semana: e.semana, scorePromedio: e.score_promedio })),
  }
}

export const reportesService = {
  async getReportes(params: Record<string, unknown> = {}): Promise<PaginatedResponse<Reporte>> {
    const { data } = await api.get<BackendReport[]>('/reportes/', { params })
    return {
      data: data.map(mapReporte),
      total: data.length,
      page: 1,
      limit: 100,
      totalPages: 1,
    }
  },

  async getStats(): Promise<ReporteStats> {
    const { data } = await api.get<BackendReportStats>('/reportes/stats')
    return {
      generados: data.reportes_generados,
      programados: data.programados,
      descargas: data.descargas,
      riesgoPromedio: data.riesgo_promedio,
    }
  },

  async getAnalitica(departamento?: string): Promise<ReporteAnalitica> {
    const { data } = await api.get<BackendAnalitica>('/reportes/analitica', { params: departamento ? { departamento } : {} })
    return mapAnalitica(data)
  },

  async generarReporte(config: ReporteCreate): Promise<Reporte> {
    const { data } = await api.post<BackendReport>('/reportes/generar', config)
    return mapReporte(data)
  },

  async descargar(id: number): Promise<Blob> {
    const { data } = await api.get(`/reportes/descargar/${id}`, { responseType: 'blob' })
    return data
  },

  async descargarExcel(ids?: string[]): Promise<Blob> {
    const params = ids && ids.length > 0 ? { ids } : {}
    const { data } = await api.get('/reportes/excel', { params, responseType: 'blob' })
    return data
  },

  async descargarPDF(contractId: string): Promise<Blob> {
    const { data } = await api.get(`/reportes/pdf/${contractId}`, { responseType: 'blob' })
    return data
  },
}
