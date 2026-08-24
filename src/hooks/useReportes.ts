import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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

export function useReporteAnalitica(departamento?: string) {
  return useQuery({
    queryKey: ['reportes-analitica', departamento],
    queryFn: () => reportesService.getAnalitica(departamento),
  })
}

export function useGenerarReporte() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: reportesService.generarReporte,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reportes'] })
      qc.invalidateQueries({ queryKey: ['reportes-stats'] })
    },
  })
}
