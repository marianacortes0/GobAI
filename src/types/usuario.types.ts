import type { UserRole } from './shared.types'

export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: UserRole
  activo: boolean
  ultimoAcceso?: string
  fechaCreacion: string
  avatar?: string
}
