import { useQuery, useMutation } from '@tanstack/react-query'
import { analisisService } from '@/services/analisis.service'

export function useAnalisis(contratoId: string) {
  return useQuery({
    queryKey: ['analisis', contratoId],
    queryFn: () => analisisService.getAnalisis(contratoId),
    enabled: !!contratoId,
  })
}

export function useEjecutarAnalisis() {
  return useMutation({
    mutationFn: analisisService.ejecutarAnalisis,
  })
}
