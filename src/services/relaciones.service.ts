import api from './api'
import { sleep } from '@/utils/helpers'
import type { FiltrosGrafo, GrafoData } from '@/types/relacion.types'

const USE_MOCK = true

const MOCK_GRAFO: GrafoData = {
  entidad_central: { id: 'ent-001', nombre: 'Termini S.A.S.', tipo: 'entidad', nit: '900.123.456-7' },
  nodos: [
    { id: 'ent-001', label: 'Termini S.A.S.', tipo: 'entidad', es_central: true, nivel_riesgo: 'medio', metadata: { nit: '900.123.456-7', ciudad: 'Bogotá', sector: 'Servicios' } },

    { id: 'prov-001', label: 'Transportes Andina S.A.S.', tipo: 'proveedor', nivel_riesgo: 'medio', metadata: { nit: '830.456.789-1', valor_total: 1450000000 } },
    { id: 'prov-002', label: 'Logística B&B Ltda.', tipo: 'proveedor', nivel_riesgo: 'alto', metadata: { nit: '901.234.567-2', valor_total: 890000000 } },
    { id: 'prov-003', label: 'Construcciones Délta', tipo: 'proveedor', nivel_riesgo: 'bajo', metadata: { nit: '830.111.222-9', valor_total: 320000000 } },
    { id: 'prov-004', label: 'Servitec del Caribe', tipo: 'proveedor', nivel_riesgo: 'medio', metadata: { nit: '900.998.776-3', valor_total: 540000000 } },

    { id: 'cont-001', label: 'Contrato 2024-114', tipo: 'contrato', nivel_riesgo: 'medio', metadata: { valor: 1450000000, objeto: 'Transporte público intermunicipal', fecha: '2024-03-12' } },
    { id: 'cont-002', label: 'Contrato 2024-201', tipo: 'contrato', nivel_riesgo: 'alto', metadata: { valor: 890000000, objeto: 'Operación logística', fecha: '2024-05-04' } },
    { id: 'cont-003', label: 'Contrato 2024-309', tipo: 'contrato', nivel_riesgo: 'bajo', metadata: { valor: 320000000, objeto: 'Mantenimiento vial', fecha: '2024-07-22' } },
    { id: 'cont-004', label: 'Contrato 2024-417', tipo: 'contrato', nivel_riesgo: 'medio', metadata: { valor: 540000000, objeto: 'Servicios técnicos', fecha: '2024-09-15' } },

    { id: 'per-001', label: 'Andrea M. Cárdenas', tipo: 'persona', nivel_riesgo: 'medio', metadata: { cedula: '1.020.456.789', rol: 'Representante legal' } },
    { id: 'per-002', label: 'Julián R. Pardo', tipo: 'persona', nivel_riesgo: 'alto', metadata: { cedula: '79.123.456', rol: 'Socio mayoritario', pep: true } },
    { id: 'per-003', label: 'Carla V. Téllez', tipo: 'persona', nivel_riesgo: 'bajo', metadata: { cedula: '1.015.789.123', rol: 'Representante legal' } },

    { id: 'ut-001', label: 'UT Andina-Délta', tipo: 'consorcio', nivel_riesgo: 'medio', metadata: { miembros: ['prov-001', 'prov-003'] } },

    { id: 'san-001', label: 'Multa SIC 2023', tipo: 'sancion', nivel_riesgo: 'alto', metadata: { monto: 120000000, fecha: '2023-11-08' } },
    { id: 'san-002', label: 'Sanción Cont. 2022', tipo: 'sancion', nivel_riesgo: 'alto', metadata: { monto: 85000000, fecha: '2022-06-01' } },

    { id: 'pep-001', label: 'Alerta PEP', tipo: 'pep', nivel_riesgo: 'alto', metadata: { fuente: 'UIAF' } },
  ],
  aristas: [
    { id: 'e-1', source: 'ent-001', target: 'cont-001', tipo: 'adjudico' },
    { id: 'e-2', source: 'ent-001', target: 'cont-002', tipo: 'adjudico' },
    { id: 'e-3', source: 'ent-001', target: 'cont-003', tipo: 'adjudico' },
    { id: 'e-4', source: 'ent-001', target: 'cont-004', tipo: 'adjudico' },

    { id: 'e-5', source: 'cont-001', target: 'prov-001', tipo: 'ejecutado_por' },
    { id: 'e-6', source: 'cont-002', target: 'prov-002', tipo: 'ejecutado_por' },
    { id: 'e-7', source: 'cont-003', target: 'prov-003', tipo: 'ejecutado_por' },
    { id: 'e-8', source: 'cont-004', target: 'prov-004', tipo: 'ejecutado_por' },

    { id: 'e-9', source: 'per-001', target: 'prov-001', tipo: 'representante_legal' },
    { id: 'e-10', source: 'per-002', target: 'prov-002', tipo: 'representante_legal' },
    { id: 'e-11', source: 'per-003', target: 'prov-004', tipo: 'representante_legal' },

    { id: 'e-12', source: 'prov-001', target: 'ut-001', tipo: 'miembro_de' },
    { id: 'e-13', source: 'prov-003', target: 'ut-001', tipo: 'miembro_de' },

    { id: 'e-14', source: 'prov-002', target: 'san-001', tipo: 'sancionado' },
    { id: 'e-15', source: 'per-002', target: 'san-002', tipo: 'sancionado' },

    { id: 'e-16', source: 'per-002', target: 'pep-001', tipo: 'alerta' },
  ],
  stats: { total_nodos: 16, total_aristas: 16, valor_total_contratos: 3200000000, alertas_alto_riesgo: 4 },
}

export const ENTIDADES_DISPONIBLES = [
  { id: 'ent-001', label: 'Termini S.A.S.' },
  { id: 'ent-002', label: 'Alcaldía de Bogotá' },
  { id: 'ent-003', label: 'Min. Transporte' },
]

export const relacionesService = {
  async getGrafo(filtros: FiltrosGrafo): Promise<GrafoData> {
    if (USE_MOCK) {
      await sleep(300)
      return aplicaFiltros(MOCK_GRAFO, filtros)
    }
    const params = new URLSearchParams({
      entidad_id: filtros.entidad_id,
      tipo_relacion: filtros.tipo_relacion,
      periodo: filtros.periodo,
      nivel_riesgo: filtros.nivel_riesgo,
    })
    const { data } = await api.get<GrafoData>(`/relaciones/grafo?${params.toString()}`)
    return data
  },
}

function aplicaFiltros(data: GrafoData, filtros: FiltrosGrafo): GrafoData {
  const nodos = data.nodos.filter((n) => {
    if (filtros.nivel_riesgo === 'todos') return true
    if (n.es_central) return true
    return n.nivel_riesgo === filtros.nivel_riesgo
  })
  const ids = new Set(nodos.map((n) => n.id))
  const aristas = data.aristas.filter((a) => {
    if (!ids.has(a.source) || !ids.has(a.target)) return false
    if (filtros.tipo_relacion === 'todos') return true
    return a.tipo === filtros.tipo_relacion
  })
  return { ...data, nodos, aristas, stats: { ...data.stats, total_nodos: nodos.length, total_aristas: aristas.length } }
}
