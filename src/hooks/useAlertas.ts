import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { alertasService } from '@/services/alertas.service'
import type { Filters } from '@/types/shared.types'

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
    onSuccess: () => qc.invalidateQueries({ queryKey: ['alertas'] }),
  })
}
