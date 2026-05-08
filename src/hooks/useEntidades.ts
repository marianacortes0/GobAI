import { useQuery } from '@tanstack/react-query'
import { entidadesService } from '@/services/entidades.service'

export function useEntidades(search?: string) {
  return useQuery({
    queryKey: ['entidades', search],
    queryFn: () => entidadesService.getEntidades({ limit: 200, search }),
    staleTime: 5 * 60 * 1000,
  })
}
