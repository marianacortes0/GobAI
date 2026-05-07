import api from './api'
import type { SystemStatus } from '@/types/configuracion.types'

export const configuracionService = {
  async getStatus(): Promise<SystemStatus> {
    const { data } = await api.get<{ data: SystemStatus }>('/configuracion/status')
    return data.data
  },

  async guardar(config: object): Promise<void> {
    await api.put('/configuracion', config)
  },

  async restaurar(): Promise<void> {
    await api.post('/configuracion/restaurar')
  },

  async exportar(): Promise<Blob> {
    const { data } = await api.get('/configuracion/exportar', { responseType: 'blob' })
    return data
  },

  async probarConexionSecop(): Promise<{ conectado: boolean; mensaje: string }> {
    const { data } = await api.post('/configuracion/probar-secop')
    return data
  },
}
