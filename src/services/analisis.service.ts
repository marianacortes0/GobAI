import api from './api'
import type { Analisis } from '@/types/analisis.types'

export const analisisService = {
  async getAnalisis(contratoId: string): Promise<Analisis> {
    const { data } = await api.get<{ data: Analisis }>(`/analisis/${contratoId}`)
    return data.data
  },

  async ejecutarAnalisis(params: { contratoId: string; modelo: string; modo: string }): Promise<Analisis> {
    const { data } = await api.post<{ data: Analisis }>('/analisis/ejecutar', params)
    return data.data
  },

  async descargarInforme(analisisId: string): Promise<Blob> {
    const { data } = await api.get(`/analisis/${analisisId}/descargar`, { responseType: 'blob' })
    return data
  },
}
