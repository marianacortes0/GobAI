import api from './api'
import type { Usuario } from '@/types/usuario.types'
import type { PaginatedResponse } from '@/types/shared.types'

export const usuariosService = {
  async getUsuarios(): Promise<PaginatedResponse<Usuario>> {
    const { data } = await api.get<PaginatedResponse<Usuario>>('/usuarios')
    return data
  },

  async crearUsuario(usuario: Partial<Usuario> & { password: string }): Promise<Usuario> {
    const { data } = await api.post<{ data: Usuario }>('/usuarios', usuario)
    return data.data
  },

  async actualizarUsuario(id: string, updates: Partial<Usuario>): Promise<Usuario> {
    const { data } = await api.put<{ data: Usuario }>(`/usuarios/${id}`, updates)
    return data.data
  },

  async eliminarUsuario(id: string): Promise<void> {
    await api.delete(`/usuarios/${id}`)
  },
}
