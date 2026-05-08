import api from './api'
import type { Analisis } from '@/types/analisis.types'

export const analisisService = {
  async getAnalisis(contratoId: string): Promise<Analisis> {
    const { data } = await api.get<Analisis>(`/analisis/${contratoId}`)
    return data
  },

  async ejecutarAnalisis(params: { contratoId: string; modelo: string; modo: string }): Promise<Analisis> {
    const { data } = await api.post<Analisis>('/analisis/ejecutar', {
      contrato_id: params.contratoId,
      modelo: params.modelo,
      modo: params.modo,
    })
    return data
  },

  async descargarInforme(analisisId: string): Promise<Blob> {
    const { data } = await api.get(`/analisis/${analisisId}/descargar`, { responseType: 'blob' })
    return data
  },
}
