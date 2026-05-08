import { useState } from 'react'
import { FileText, CheckCircle, Loader, AlertTriangle, ExternalLink, DollarSign, ShieldAlert, Bell } from 'lucide-react'
import { KPICard } from '@/components/common/KPICard'
import { SearchBox } from '@/components/common/SearchBox'
import { RiskBadge } from '@/components/common/RiskBadge'
import { StatusBadge } from '@/components/common/StatusBadge'
import { ScoreCircle } from '@/components/common/ScoreCircle'
import { DataTable, type Column } from '@/components/common/DataTable'
import { useContratos, useContractSummary, useDepartamentos, useModalidades } from '@/hooks/useContratos'
import { useDebounce } from '@/hooks/useDebounce'
import { useFiltersStore } from '@/store/filters.store'
import { RISK_COLORS } from '@/utils/constants'
import { formatCurrency, formatDate } from '@/utils/formatters'
import type { Contrato } from '@/types/contrato.types'

const MOCK_CONTRATOS: Contrato[] = [
  { id: '1', idProceso: 'SN-2024-001234', entidad: 'Alcaldía de Bogotá', departamento: 'Cundinamarca', municipio: 'Bogotá', procedimiento: 'Obra pública', modalidad: 'Licitación Pública', objeto: 'Construcción vías terciarias', valorBase: 4500000000, estado: 'PUBLICADO', fechaPublicacion: '2024-01-15', riesgo: 'ALTO', scoreRiesgo: 82, senalesDetectadas: ['Precio inusual', 'Restricción competencia'], tieneAlertas: true },
  { id: '2', idProceso: 'SN-2024-002891', entidad: 'Gobernación Antioquia', departamento: 'Antioquia', municipio: 'Medellín', procedimiento: 'Suministro', modalidad: 'Selección Abreviada', objeto: 'Equipos médicos', valorBase: 1200000000, estado: 'ADJUDICADO', fechaPublicacion: '2024-02-01', riesgo: 'CRÍTICO', scoreRiesgo: 91, senalesDetectadas: ['Proponente único'], tieneAlertas: true },
  { id: '3', idProceso: 'SN-2024-003456', entidad: 'SENA', departamento: 'Valle del Cauca', municipio: 'Cali', procedimiento: 'Consultoría', modalidad: 'Concurso de Méritos', objeto: 'Consultoría tecnológica', valorBase: 890000000, estado: 'EN_EJECUCION', fechaPublicacion: '2024-01-28', riesgo: 'MEDIO', scoreRiesgo: 58, senalesDetectadas: [], tieneAlertas: false },
  { id: '4', idProceso: 'SN-2024-004120', entidad: 'Min. Salud', departamento: 'Bogotá D.C.', municipio: 'Bogotá', procedimiento: 'Compra', modalidad: 'Contratación Directa', objeto: 'Insumos hospitalarios', valorBase: 320000000, estado: 'PUBLICADO', fechaPublicacion: '2024-02-10', riesgo: 'BAJO', scoreRiesgo: 31, senalesDetectadas: [], tieneAlertas: false },
  { id: '5', idProceso: 'SN-2024-005678', entidad: 'IDU Bogotá', departamento: 'Cundinamarca', municipio: 'Bogotá', procedimiento: 'Infraestructura', modalidad: 'Licitación Pública', objeto: 'Mantenimiento malla vial', valorBase: 7800000000, estado: 'PUBLICADO', fechaPublicacion: '2024-02-05', riesgo: 'ALTO', scoreRiesgo: 78, senalesDetectadas: ['Fraccionamiento'], tieneAlertas: true },
]

type TabId = 'todos' | 'alto' | 'alertas' | 'adjudicados'

export function ContratosPage() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<TabId>('todos')
  const [selected, setSelected] = useState<Contrato | null>(null)
  const debouncedSearch = useDebounce(search)
  const { contratosFilters, setContratosFilters } = useFiltersStore()

  const filters = { ...contratosFilters, search: debouncedSearch }
  const { data: contratos, isLoading } = useContratos(filters)
  const { data: summary } = useContractSummary()
  const { data: departamentos } = useDepartamentos()
  const { data: modalidades } = useModalidades()

  const filteredMock = MOCK_CONTRATOS.filter(c => {
    if (contratosFilters.riesgo && c.riesgo !== contratosFilters.riesgo) return false
    if (contratosFilters.departamento && c.departamento !== contratosFilters.departamento) return false
    if (contratosFilters.modalidad && c.modalidad !== contratosFilters.modalidad) return false
    if (contratosFilters.estado && c.estado !== contratosFilters.estado) return false
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      return c.entidad.toLowerCase().includes(q) || c.idProceso.toLowerCase().includes(q) || c.objeto.toLowerCase().includes(q)
    }
    return true
  })
  const displayData = contratos?.data ?? filteredMock

  const tabs: { id: TabId; label: string }[] = [
    { id: 'todos', label: 'Todos' },
    { id: 'alto', label: 'Riesgo alto' },
    { id: 'alertas', label: 'Con alertas' },
    { id: 'adjudicados', label: 'Adjudicados' },
  ]

  const filtered = displayData.filter(c => {
    if (activeTab === 'alto') return c.riesgo === 'ALTO' || c.riesgo === 'CRÍTICO'
    if (activeTab === 'alertas') return c.tieneAlertas
    if (activeTab === 'adjudicados') return c.estado === 'ADJUDICADO'
    return true
  })

  const columns: Column<Contrato>[] = [
    { key: 'id', header: 'ID Proceso', accessor: (c) => c.idProceso, render: (v) => <span className="font-mono text-xs text-blue-600">{String(v)}</span> },
    { key: 'entidad', header: 'Entidad', accessor: (c) => c.entidad },
    { key: 'procedimiento', header: 'Procedimiento', accessor: (c) => c.procedimiento },
    { key: 'modalidad', header: 'Modalidad', accessor: (c) => c.modalidad },
    { key: 'estado', header: 'Estado', accessor: (c) => c.estado, render: (v) => <StatusBadge status={v as Contrato['estado']} /> },
    { key: 'valor', header: 'Valor Base', accessor: (c) => c.valorBase, render: (v) => <span className="font-medium">{formatCurrency(Number(v))}</span> },
    { key: 'riesgo', header: 'Riesgo', accessor: (c) => c.riesgo, render: (v, item) => {
      const colors: Record<string, string> = { 'CRÍTICO': '#DC2626', 'ALTO': '#EF4444', 'MEDIO': '#F59E0B', 'BAJO': '#10B981' }
      const riesgo = (item as Contrato).riesgo
      return (
        <div className="flex items-center gap-2">
          <RiskBadge level={v as Contrato['riesgo']} size="sm" />
          <span className="w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0" style={{ backgroundColor: colors[riesgo] ?? '#94A3B8' }}>{(item as Contrato).scoreRiesgo}</span>
        </div>
      )
    }},
    { key: 'fecha', header: 'Fecha', accessor: (c) => c.fechaPublicacion, render: (v) => <span className="text-slate-400 text-xs">{formatDate(String(v))}</span> },
  ]

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Contratos</h1>
          <p className="text-sm text-slate-500 mt-0.5">Consulta y gestiona procesos contractuales publicados en SECOP II</p>
        </div>

        <SearchBox
          placeholder="Buscar por entidad, proceso, objeto..."
          value={search}
          onChange={setSearch}
          className="max-w-xl"
        />

        <div className="flex flex-wrap items-center gap-3 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <select value={contratosFilters.departamento ?? ''} onChange={(e) => setContratosFilters({ departamento: e.target.value || undefined })} className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 bg-white outline-none focus:border-blue-400">
            <option value="">Departamento</option>
            {(departamentos ?? []).map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={contratosFilters.modalidad ?? ''} onChange={(e) => setContratosFilters({ modalidad: e.target.value || undefined })} className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 bg-white outline-none focus:border-blue-400">
            <option value="">Modalidad</option>
            {(modalidades ?? []).map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={contratosFilters.estado ?? ''} onChange={(e) => setContratosFilters({ estado: e.target.value || undefined })} className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 bg-white outline-none focus:border-blue-400">
            <option value="">Estado</option>
            {(['PUBLICADO', 'ADJUDICADO', 'EN_EJECUCION', 'TERMINADO'] as const).map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
          <select value={contratosFilters.riesgo ?? ''} onChange={(e) => setContratosFilters({ riesgo: (e.target.value as Contrato['riesgo']) || undefined })} className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 bg-white outline-none focus:border-blue-400">
            <option value="">Nivel de riesgo</option>
            {(['CRÍTICO', 'ALTO', 'MEDIO', 'BAJO'] as const).map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <button
            onClick={() => { setContratosFilters({ departamento: undefined, modalidad: undefined, estado: undefined, riesgo: undefined }); setSearch('') }}
            className="px-3 py-2 text-sm text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5"
          >
            <span>✕</span> Limpiar filtros
          </button>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard title="Total contratos" value={summary?.total ?? contratos?.total ?? 0} icon={FileText} />
          <KPICard title="Adjudicados" value={summary?.adjudicados ?? 0} icon={CheckCircle} iconBg="bg-green-50" iconColor="text-green-500" />
          <KPICard title="En análisis" value={summary?.en_analisis ?? 0} icon={Loader} iconBg="bg-orange-50" iconColor="text-orange-500" />
          <KPICard title="Riesgo alto" value={summary?.riesgo_alto ?? 0} icon={AlertTriangle} iconBg="bg-red-50" iconColor="text-red-500" valueColor="text-red-600" />
        </div>

        <div className="flex border-b border-slate-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          isLoading={isLoading}
          onRowClick={setSelected}
          selectedItem={selected}
          keyExtractor={(c) => c.id}
          pagination={contratos ? { page: contratos.page, limit: contratos.limit, total: contratos.total, onPageChange: (p) => setContratosFilters({ page: p }) } : undefined}
        />
      </div>

      {/* Resumen general — siempre visible */}
      <aside className="w-60 shrink-0">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5 sticky top-6">
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold tracking-wide mb-0.5">Resumen general</p>
            <h3 className="text-sm font-bold text-slate-800">Vista actual</h3>
          </div>

          {/* Total visible */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-blue-700">{filtered.length}</p>
              <p className="text-xs text-blue-500">contratos</p>
            </div>
          </div>

          {/* Distribución riesgo */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Por nivel de riesgo</p>
            <div className="space-y-2">
              {(['CRÍTICO', 'ALTO', 'MEDIO', 'BAJO'] as const).map(nivel => {
                const count = filtered.filter(c => c.riesgo === nivel).length
                const pct = filtered.length > 0 ? Math.round((count / filtered.length) * 100) : 0
                if (count === 0) return null
                return (
                  <div key={nivel}>
                    <div className="flex items-center justify-between mb-0.5">
                      <RiskBadge level={nivel} size="sm" />
                      <span className="text-xs text-slate-500">{count} <span className="text-slate-400">({pct}%)</span></span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: RISK_COLORS[nivel] }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-0 divide-y divide-slate-100">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <DollarSign className="w-3.5 h-3.5 text-blue-400" />
                Valor total
              </div>
              <span className="text-xs font-bold text-slate-700">
                {formatCurrency(filtered.reduce((s, c) => s + c.valorBase, 0))}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Bell className="w-3.5 h-3.5 text-orange-400" />
                Con alertas
              </div>
              <span className="text-xs font-bold text-orange-600">
                {filtered.filter(c => c.tieneAlertas).length}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                Alto + Crítico
              </div>
              <span className="text-xs font-bold text-red-600">
                {filtered.filter(c => c.riesgo === 'ALTO' || c.riesgo === 'CRÍTICO').length}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                Adjudicados
              </div>
              <span className="text-xs font-bold text-green-600">
                {filtered.filter(c => c.estado === 'ADJUDICADO').length}
              </span>
            </div>
          </div>

          {/* Score promedio */}
          {filtered.length > 0 && (() => {
            const avg = Math.round(filtered.reduce((s, c) => s + c.scoreRiesgo, 0) / filtered.length)
            const color = avg >= 70 ? '#DC2626' : avg >= 50 ? '#F59E0B' : '#10B981'
            return (
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-500 mb-1">Score promedio</p>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-bold" style={{ color }}>{avg}</span>
                  <span className="text-xs text-slate-400 mb-1">/100</span>
                </div>
              </div>
            )
          })()}
        </div>
      </aside>

      {selected && (
        <aside className="w-72 shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 sticky top-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">Detalle del contrato</h3>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>
            <ScoreCircle score={selected.scoreRiesgo} riskCategory={selected.riesgo} />
            <div className="space-y-2 text-xs text-slate-600">
              <p><strong>ID:</strong> {selected.idProceso}</p>
              <p><strong>Entidad:</strong> {selected.entidad}</p>
              {selected.departamento && <p><strong>Región:</strong> {selected.departamento}{selected.municipio ? ` — ${selected.municipio}` : ''}</p>}
              <p><strong>Objeto:</strong> {selected.objeto}</p>
              <p><strong>Modalidad:</strong> {selected.modalidad}</p>
              <p><strong>Valor:</strong> {formatCurrency(selected.valorBase)}</p>
              <p><strong>Publicación:</strong> {formatDate(selected.fechaPublicacion)}</p>
            </div>
            {selected.senalesDetectadas.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1.5">Señales</p>
                <div className="space-y-1">
                  {selected.senalesDetectadas.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 text-white text-xs rounded-lg font-medium hover:bg-blue-700">
                Analizar con IA
              </button>
              <a
                href="https://community.secop.gov.co/STS/Users/Login/Index?SkinName=CCE&currentLanguage=es-CO&Page=login&Country=CO"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 border border-slate-200 text-slate-600 text-xs rounded-lg font-medium hover:bg-slate-50"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Ver en SECOP
              </a>
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}
