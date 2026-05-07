import { useQuery, useMutation } from '@tanstack/react-query'
import { reportesService } from '@/services/reportes.service'

export function useReportes(params = {}) {
  return useQuery({
    queryKey: ['reportes', params],
    queryFn: () => reportesService.getReportes(params),
  })
}

export function useReporteStats() {
  return useQuery({
    queryKey: ['reportes-stats'],
    queryFn: () => reportesService.getStats(),
  })
}

export function useGenerarReporte() {
  return useMutation({
    mutationFn: reportesService.generarReporte,
  })
}
