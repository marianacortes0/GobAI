import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { FiltrosGrafo } from '@/types/relacion.types'

const DEFAULTS: FiltrosGrafo = {
  entidad_id: 'ent-001',
  tipo_relacion: 'todos',
  periodo: '12m',
  nivel_riesgo: 'todos',
}

export function useGrafoFiltros() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filtros = useMemo<FiltrosGrafo>(
    () => ({
      entidad_id: searchParams.get('entidad') ?? DEFAULTS.entidad_id,
      tipo_relacion: (searchParams.get('tipo') as FiltrosGrafo['tipo_relacion']) ?? DEFAULTS.tipo_relacion,
      periodo: (searchParams.get('periodo') as FiltrosGrafo['periodo']) ?? DEFAULTS.periodo,
      nivel_riesgo: (searchParams.get('riesgo') as FiltrosGrafo['nivel_riesgo']) ?? DEFAULTS.nivel_riesgo,
    }),
    [searchParams],
  )

  const setFiltros = useCallback(
    (parcial: Partial<FiltrosGrafo>) => {
      const next = { ...filtros, ...parcial }
      const params = new URLSearchParams()
      if (next.entidad_id !== DEFAULTS.entidad_id) params.set('entidad', next.entidad_id)
      if (next.tipo_relacion !== DEFAULTS.tipo_relacion) params.set('tipo', next.tipo_relacion)
      if (next.periodo !== DEFAULTS.periodo) params.set('periodo', next.periodo)
      if (next.nivel_riesgo !== DEFAULTS.nivel_riesgo) params.set('riesgo', next.nivel_riesgo)
      setSearchParams(params, { replace: true })
    },
    [filtros, setSearchParams],
  )

  const resetFiltros = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true })
  }, [setSearchParams])

  return { filtros, setFiltros, resetFiltros }
}
