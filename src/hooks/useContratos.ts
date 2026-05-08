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

export function useContractSummary() {
  return useQuery({
    queryKey: ['contratos-summary'],
    queryFn: () => contratosService.getSummary(),
  })
}

export function useDepartamentos() {
  return useQuery({
    queryKey: ['departamentos'],
    queryFn: () => contratosService.getDepartamentos(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useModalidades() {
  return useQuery({
    queryKey: ['modalidades'],
    queryFn: () => contratosService.getModalidades(),
    staleTime: 5 * 60 * 1000,
  })
}
