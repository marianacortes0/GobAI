import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboard.service'
import type { Filters } from '@/types/shared.types'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats(),
  })
}

export function useContratosPriorizados(filters: Filters = {}) {
  return useQuery({
    queryKey: ['contratos-priorizados', filters],
    queryFn: () => dashboardService.getContratosPriorizados(filters),
  })
}
