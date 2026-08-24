import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { configuracionService } from '@/services/configuracion.service'

export function useConfiguracionActual() {
  return useQuery({
    queryKey: ['configuracion'],
    queryFn: () => configuracionService.obtener(),
  })
}

export function useConfiguracionStatus() {
  return useQuery({
    queryKey: ['configuracion-status'],
    queryFn: () => configuracionService.getStatus(),
  })
}

export function useGuardarConfiguracion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: configuracionService.guardar,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['configuracion'] })
      qc.invalidateQueries({ queryKey: ['configuracion-status'] })
    },
  })
}

export function useRestaurarConfiguracion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: configuracionService.restaurar,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['configuracion'] })
      qc.invalidateQueries({ queryKey: ['configuracion-status'] })
    },
  })
}

export function useExportarConfiguracion() {
  return useMutation({
    mutationFn: configuracionService.exportar,
  })
}

export function useProbarConexionSecop() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: configuracionService.probarConexionSecop,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['configuracion'] }),
  })
}

export function useRespaldo() {
  return useQuery({
    queryKey: ['respaldo'],
    queryFn: () => configuracionService.getRespaldo(),
  })
}

export function useRealizarRespaldo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: configuracionService.realizarRespaldo,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['respaldo'] }),
  })
}

export function useHistorialCambios() {
  return useQuery({
    queryKey: ['historial-cambios'],
    queryFn: () => configuracionService.getHistorial(),
  })
}

export function useSeguridad() {
  return useQuery({
    queryKey: ['seguridad'],
    queryFn: () => configuracionService.getSeguridad(),
  })
}

export function useEjecutarVerificacion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: configuracionService.ejecutarVerificacion,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['seguridad'] }),
  })
}
