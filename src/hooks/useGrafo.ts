import { useQuery } from '@tanstack/react-query'
import { relacionesService } from '@/services/relaciones.service'
import type { FiltrosGrafo } from '@/types/relacion.types'

export function useGrafo(filtros: FiltrosGrafo) {
  return useQuery({
    queryKey: ['grafo', filtros],
    queryFn: () => relacionesService.getGrafo(filtros),
    staleTime: 60_000,
    enabled: !!filtros.entidad_id,
  })
}
