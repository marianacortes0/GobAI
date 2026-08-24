import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { alertasService } from '@/services/alertas.service'
import type { Filters, AlertStatus } from '@/types/shared.types'

export function useAlertas(filters: Filters = {}) {
  return useQuery({
    queryKey: ['alertas', filters],
    queryFn: () => alertasService.getAlertas(filters),
  })
}

export function useAlertaStats() {
  return useQuery({
    queryKey: ['alertas-stats'],
    queryFn: () => alertasService.getStats(),
  })
}

export function useMarcarRevisada() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: alertasService.marcarRevisada,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['alertas'] })
      qc.invalidateQueries({ queryKey: ['alertas-stats'] })
    },
  })
}

export function useActualizarEstadoAlerta() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: AlertStatus }) => alertasService.actualizarEstado(id, estado),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['alertas'] })
      qc.invalidateQueries({ queryKey: ['alertas-stats'] })
    },
  })
}
