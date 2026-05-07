import { useState } from 'react'
import { FileText, AlertTriangle, Clock, Building2, Eye, ExternalLink, FlaskConical } from 'lucide-react'
import { KPICard } from '@/components/common/KPICard'
import { RiskBadge } from '@/components/common/RiskBadge'
import { ScoreCircle } from '@/components/common/ScoreCircle'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { DataTable, type Column } from '@/components/common/DataTable'
import { DonutChart } from '@/components/charts/DonutChart'
import { useDashboardStats, useContratosPriorizados } from '@/hooks/useDashboard'
import { useFiltersStore } from '@/store/filters.store'
import { DEPARTAMENTOS, MODALIDADES, RISK_COLORS } from '@/utils/constants'
import { formatCurrency } from '@/utils/formatters'
import type { Contrato } from '@/types/contrato.types'

const ENTIDADES = ['Alcaldía de Bogotá', 'Gobernación Antioquia', 'IDU Bogotá', 'Min. Salud', 'SENA', 'DNP', 'Min. Educación']

const MOCK_STATS = { totalContratos: 1248, riesgoAlto: 86, riesgoMedio: 241, entidadesMonitoreadas: 132, distribucionRiesgo: { critico: 12, alto: 74, medio: 241, bajo: 921 } }
const MOCK_CONTRATOS: Contrato[] = [
  { id: '1', idProceso: 'SN-2024-001234', entidad: 'Alcaldía de Bogotá', departamento: 'Cundinamarca', municipio: 'Bogotá', procedimiento: 'Obra pública vías', modalidad: 'Licitación Pública', objeto: 'Construcción vías terciarias', valorBase: 4500000000, estado: 'PUBLICADO', fechaPublicacion: '2024-01-15', riesgo: 'ALTO', scoreRiesgo: 82, senalesDetectadas: ['Precio inusual', 'Restricción competencia'], tieneAlertas: true },
  { id: '2', idProceso: 'SN-2024-002891', entidad: 'Gobernación Antioquia', departamento: 'Antioquia', municipio: 'Medellín', procedimiento: 'Suministro equipos', modalidad: 'Selección Abreviada', objeto: 'Adquisición equipos médicos', valorBase: 1200000000, estado: 'ADJUDICADO', fechaPublicacion: '2024-02-01', riesgo: 'CRÍTICO', scoreRiesgo: 91, senalesDetectadas: ['Proponente único', 'Urgencia no justificada'], tieneAlertas: true },
  { id: '3', idProceso: 'SN-2024-003456', entidad: 'SENA', departamento: 'Valle del Cauca', municipio: 'Cali', procedimiento: 'Consultoría', modalidad: 'Concurso de Méritos', objeto: 'Consultoría tecnológica', valorBase: 890000000, estado: 'EN_EJECUCION', fechaPublicacion: '2024-01-28', riesgo: 'MEDIO', scoreRiesgo: 58, senalesDetectadas: ['Experiencia mínima'], tieneAlertas: false },
  { id: '4', idProceso: 'SN-2024-004120', entidad: 'Min. Salud', departamento: 'Bogotá D.C.', municipio: 'Bogotá', procedimiento: 'Compra directa', modalidad: 'Contratación Directa', objeto: 'Insumos hospitalarios', valorBase: 320000000, estado: 'PUBLICADO', fechaPublicacion: '2024-02-10', riesgo: 'BAJO', scoreRiesgo: 31, senalesDetectadas: [], tieneAlertas: false },
  { id: '5', idProceso: 'SN-2024-005678', entidad: 'IDU Bogotá', departamento: 'Cundinamarca', municipio: 'Bogotá', procedimiento: 'Infraestructura', modalidad: 'Licitación Pública', objeto: 'Mantenimiento malla vial', valorBase: 7800000000, estado: 'PUBLICADO', fechaPublicacion: '2024-02-05', riesgo: 'ALTO', scoreRiesgo: 78, senalesDetectadas: ['Fraccionamiento', 'Precio base elevado'], tieneAlertas: true },
]

export function DashboardPage() {
  const { dashboardFilters, setDashboardFilters } = useFiltersStore()
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: contratos, isLoading: contratosLoading } = useContratosPriorizados(dashboardFilters)
  const [selectedContrato, setSelectedContrato] = useState<Contrato | null>(null)

  const isDemo = !statsLoading && !stats
  const displayStats = stats ?? MOCK_STATS
  const displayContratos = contratos?.data ?? MOCK_CONTRATOS

  const donutData = [
    { name: 'Crítico', value: displayStats.distribucionRiesgo.critico, color: RISK_COLORS['CRÍTICO'] },
    { name: 'Alto', value: displayStats.distribucionRiesgo.alto, color: RISK_COLORS['ALTO'] },
    { name: 'Medio', value: displayStats.distribucionRiesgo.medio, color: RISK_COLORS['MEDIO'] },
    { name: 'Bajo', value: displayStats.distribucionRiesgo.bajo, color: RISK_COLORS['BAJO'] },
  ]

  const columns: Column<Contrato>[] = [
    { key: 'idProceso', header: 'ID Proceso', accessor: (c) => c.idProceso },
    { key: 'entidad', header: 'Entidad', accessor: (c) => c.entidad },
    { key: 'modalidad', header: 'Modalidad', accessor: (c) => c.modalidad },
    { key: 'valor', header: 'Valor Base', accessor: (c) => c.valorBase, render: (v) => <span className="font-medium">{formatCurrency(Number(v))}</span> },
    { key: 'score', header: 'Score', accessor: (c) => c.scoreRiesgo, render: (v, item) => (
      <span className="w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0" style={{ backgroundColor: RISK_COLORS[(item as Contrato).riesgo] }}>{String(v)}</span>
    )},
    { key: 'riesgo', header: 'Riesgo', accessor: (c) => c.riesgo, render: (v) => <RiskBadge level={v as Contrato['riesgo']} size="sm" /> },
    { key: 'senales', header: 'Señales', accessor: (c) => c.senalesDetectadas.length, render: (v) => <span className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded text-xs font-semibold">{String(v)}</span> },
    { key: 'accion', header: '', accessor: () => '', render: (_, item) => (
      <button onClick={(e) => { e.stopPropagation(); setSelectedContrato(item) }} className="p-1.5 rounded hover:bg-slate-100">
        <Eye className="w-4 h-4 text-slate-500" />
      </button>
    )},
  ]

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Monitoreo de Riesgo Contractual</h1>
          <p className="text-sm text-slate-500 mt-0.5">Analiza y prioriza contratos públicos colombianos por señales de opacidad y riesgo — SECOP II</p>
        </div>

        {isDemo && (
          <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            <FlaskConical className="w-4 h-4 text-amber-500 shrink-0" />
            <span><strong>Modo demo:</strong> el backend no está disponible. Los datos mostrados son de ejemplo y no provienen de SECOP II.</span>
          </div>
        )}

        {statsLoading ? <LoadingSpinner /> : (
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <KPICard title="Contratos analizados" value={displayStats.totalContratos} trend={3.2} trendLabel="vs mes ant." icon={FileText} iconBg="bg-blue-50" iconColor="text-blue-500" />
            <KPICard title="Riesgo alto" value={displayStats.riesgoAlto} trend={-1.8} icon={AlertTriangle} iconBg="bg-red-50" iconColor="text-red-500" valueColor="text-red-600" />
            <KPICard title="Riesgo medio" value={displayStats.riesgoMedio} trend={2.1} icon={Clock} iconBg="bg-orange-50" iconColor="text-orange-500" valueColor="text-orange-600" />
            <KPICard title="Entidades monitoreadas" value={displayStats.entidadesMonitoreadas} icon={Building2} iconBg="bg-green-50" iconColor="text-green-500" />
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-wrap items-end gap-3">
            <select onChange={(e) => setDashboardFilters({ departamento: e.target.value || undefined })} className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 bg-white outline-none focus:border-blue-400">
              <option value="">Departamento</option>
              {DEPARTAMENTOS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select onChange={(e) => setDashboardFilters({ entidad: e.target.value || undefined })} className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 bg-white outline-none focus:border-blue-400">
              <option value="">Entidad</option>
              {ENTIDADES.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <select onChange={(e) => setDashboardFilters({ modalidad: e.target.value || undefined })} className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 bg-white outline-none focus:border-blue-400">
              <option value="">Modalidad</option>
              {MODALIDADES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select onChange={(e) => setDashboardFilters({ riesgo: (e.target.value as Contrato['riesgo']) || undefined })} className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 bg-white outline-none focus:border-blue-400">
              <option value="">Riesgo</option>
              {(['CRÍTICO', 'ALTO', 'MEDIO', 'BAJO'] as const).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              Analizar
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Contratos priorizados</h2>
          <DataTable
            columns={columns}
            data={displayContratos}
            isLoading={contratosLoading}
            onRowClick={setSelectedContrato}
            selectedItem={selectedContrato}
            keyExtractor={(c) => c.id}
            pagination={contratos ? { page: contratos.page, limit: contratos.limit, total: contratos.total, onPageChange: (p) => setDashboardFilters({ page: p }) } : undefined}
          />
        </div>
      </div>

      {selectedContrato && (
        <aside className="w-72 shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 sticky top-6">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Detalle del análisis</p>
                <h3 className="text-sm font-semibold text-slate-800 leading-snug">{selectedContrato.procedimiento}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedContrato.entidad}</p>
              </div>
              <button onClick={() => setSelectedContrato(null)} className="text-slate-400 hover:text-slate-600 text-xs shrink-0">✕</button>
            </div>
            <ScoreCircle score={selectedContrato.scoreRiesgo} riskCategory={selectedContrato.riesgo} size="md" />
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Señales detectadas</p>
              <div className="space-y-1.5">
                {selectedContrato.senalesDetectadas.length > 0
                  ? selectedContrato.senalesDetectadas.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                      {s}
                    </div>
                  ))
                  : <p className="text-xs text-slate-400">Sin señales detectadas</p>
                }
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-slate-500">
              <p><strong className="text-slate-600">Modalidad:</strong> {selectedContrato.modalidad}</p>
              <p><strong className="text-slate-600">Valor:</strong> {formatCurrency(selectedContrato.valorBase)}</p>
              <p><strong className="text-slate-600">Depto:</strong> {selectedContrato.departamento}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Distribución de riesgo</p>
              <DonutChart data={donutData} total={displayStats.totalContratos} centerLabel="total" />
            </div>
            <div className="pt-2 border-t border-slate-100">
              <button className="w-full flex items-center justify-center gap-2 py-2 border border-slate-200 text-slate-600 text-xs rounded-lg font-medium hover:bg-slate-50">
                <ExternalLink className="w-3.5 h-3.5" /> Ver en SECOP
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}
