import api from './api'
import type { Analisis } from '@/types/analisis.types'

// Removed obsolete mocked mapping logic

const mapToAnalisis = (data: any): Analisis => ({
  id: data.id,
  contratoId: data.contrato_id,
  idProceso: data.id_proceso,
  entidad: data.entidad,
  modelo: data.modelo,
  modoAnalisis: data.modo_analisis,
  scoreTotal: data.score_total,
  senalesCriticas: data.senales_criticas,
  hallazgosIA: data.hallazgos_ia,
  confianza: data.confianza,
  riesgo: data.riesgo,
  resumenEjecutivo: data.resumen_ejecutivo,
  factoresPonderados: (data.factores_ponderados || []).map((f: any) => ({
    nombre: f.nombre,
    peso: f.peso,
    valor: f.valor,
    color: f.color
  })),
  trazabilidad: (data.trazabilidad || []).map((t: any) => ({
    numero: t.numero,
    titulo: t.titulo,
    descripcion: t.descripcion,
    estado: t.estado
  })),
  hallazgos: (data.hallazgos || []).map((h: any) => ({
    id: h.id,
    titulo: h.titulo,
    descripcion: h.descripcion,
    severidad: h.severidad,
    tipo: h.tipo
  })),
  evidencias: (data.evidencias || []).map((e: any) => ({
    campo: e.campo,
    texto: e.texto || '',
    relevancia: e.relevancia
  })),
  recomendaciones: data.recomendaciones || [],
  fechaAnalisis: data.fecha_analisis,
  entradasAnalizadas: data.entradas_analizadas || []
})

export const analisisService = {
  async getAnalisis(contratoId: string): Promise<Analisis> {
    const { data } = await api.get<any>(`/analisis/${contratoId}`)
    return mapToAnalisis(data)
  },

  async ejecutarAnalisis(params: { contratoId: string; modelo: string; modo: string }): Promise<Analisis> {
    const { data } = await api.post<any>('/analisis/ejecutar', {
      id_contrato: params.contratoId,
      modelo: params.modelo,
      modo: params.modo,
    })
    return mapToAnalisis(data)
  },

  async descargarInforme(analisisId: string): Promise<Blob> {
    const { data } = await api.get(`/analisis/${analisisId}/descargar`, { responseType: 'blob' })
    return data
  },
}
