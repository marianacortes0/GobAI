import { useQuery } from '@tanstack/react-query'
import { contratosService } from '@/services/contratos.service'
import type { Filters } from '@/types/shared.types'

export function useContratos(filters: Filters = {}) {
  return useQuery({
    queryKey: ['contratos', filters],
    queryFn: () => contratosService.getContratos(filters),
  })
}

export function useContrato(id: string) {
  return useQuery({
    queryKey: ['contrato', id],
    queryFn: () => contratosService.getContrato(id),
    enabled: !!id,
  })
}
