import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, AlertTriangle, Clock, CheckCircle, ExternalLink, Brain, Download, Loader2 } from 'lucide-react'
import { KPICard } from '@/components/common/KPICard'
import { SearchBox } from '@/components/common/SearchBox'
import { SeverityBadge } from '@/components/common/SeverityBadge'
import { StatusBadge } from '@/components/common/StatusBadge'
import { ScoreCircle } from '@/components/common/ScoreCircle'
import { DataTable, type Column } from '@/components/common/DataTable'
import { DonutChart } from '@/components/charts/DonutChart'
import { useAlertas, useAlertaStats, useMarcarRevisada } from '@/hooks/useAlertas'
import { useDepartamentos } from '@/hooks/useContratos'
import { useDebounce } from '@/hooks/useDebounce'
import { useFiltersStore } from '@/store/filters.store'
import { useToast } from '@/hooks/useToast'
import { RISK_COLORS } from '@/utils/constants'
import { formatDate } from '@/utils/formatters'
import { reportesService } from '@/services/reportes.service'
import { FLAG_LABELS } from '@/services/alertas.service'
import type { Alerta } from '@/types/alerta.types'
import type { Severity } from '@/types/shared.types'

const PRIORIDAD_COLOR: Record<string, string> = {
  'CRÍTICO': 'bg-red-100 text-red-700 border-red-200',
  'ALTO': 'bg-orange-100 text-orange-700 border-orange-200',
  'MEDIO': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'BAJO': 'bg-green-100 text-green-700 border-green-200',
}

function flagLabel(flag: string): string {
  return FLAG_LABELS[flag] ?? flag.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
}

type TabId = 'todas' | 'criticas' | 'seguimiento' | 'resueltas'

export function AlertasPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<TabId>('todas')
  const [selected, setSelected] = useState<Alerta | null>(null)
  const [filterTipo, setFilterTipo] = useState('')
  const [exportando, setExportando] = useState(false)
  const debouncedSearch = useDebounce(search)
  const { alertasFilters, setAlertasFilters, resetFilters } = useFiltersStore()

  const filters = { ...alertasFilters, search: debouncedSearch }
  const { data: alertas, isLoading } = useAlertas(filters)
  const { data: stats } = useAlertaStats()
  const { data: departamentos } = useDepartamentos()
  const { mutate: marcarRevisada, isPending: marcando } = useMarcarRevisada()
  const displayData = alertas?.data ?? []
  const tiposDisponibles = Array.from(new Set(displayData.map(a => a.tipo).filter(Boolean))).sort()

  const tabs: { id: TabId; label: string }[] = [
    { id: 'todas', label: 'Todas' },
    { id: 'criticas', label: 'Críticas' },
    { id: 'seguimiento', label: 'En seguimiento' },
    { id: 'resueltas', label: 'Resueltas' },
  ]

  function handleTabChange(tab: TabId) {
    setActiveTab(tab)
    if (tab === 'criticas') setAlertasFilters({ riesgo: 'CRÍTICO', estado: undefined })
    else if (tab === 'seguimiento') setAlertasFilters({ riesgo: undefined, estado: 'EN_SEGUIMIENTO' })
    else if (tab === 'resueltas') setAlertasFilters({ riesgo: undefined, estado: 'RESUELTA' })
    else setAlertasFilters({ riesgo: undefined, estado: undefined })
  }

  const filtered = displayData.filter(a => {
    if (filterTipo && a.tipo !== filterTipo) return false
    return true
  })

  function handleLimpiar() {
    setFilterTipo('')
    setSearch('')
    setActiveTab('todas')
    resetFilters('alertas')
  }

  async function handleExportar() {
    setExportando(true)
    try {
      const ids = filtered.map((a) => a.id)
      const blob = await reportesService.descargarExcel(ids.length > 0 ? ids : undefined)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'alertas_gobia.xlsx'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('No se pudo exportar las alertas')
    } finally {
      setExportando(false)
    }
  }

  const columns: Column<Alerta>[] = [
    { key: 'sev', header: 'Severidad', accessor: (a) => a.severidad, render: (v) => <SeverityBadge level={v as Severity} size="sm" /> },
    { key: 'tipo', header: 'Tipo de alerta', accessor: (a) => a.tipo },
    { key: 'entidad', header: 'Entidad', accessor: (a) => a.entidad },
    { key: 'proceso', header: 'Proceso', accessor: (a) => a.idProceso, render: (v) => <span className="font-mono text-xs text-blue-600">{String(v)}</span> },
    { key: 'senal', header: 'Señal detectada', accessor: (a) => a.senalDetectada },
    { key: 'fecha', header: 'Fecha', accessor: (a) => a.fechaDeteccion, render: (v) => <span className="text-slate-400 text-xs">{formatDate(String(v))}</span> },
    { key: 'estado', header: 'Estado', accessor: (a) => a.estado, render: (v) => <StatusBadge status={v as Alerta['estado']} /> },
  ]

  const criticas = stats?.riesgo_critico ?? displayData.filter(a => a.severidad === 'CRÍTICA').length
  const enSeguimiento = displayData.filter(a => a.estado === 'EN_SEGUIMIENTO').length
  const resueltas = stats?.revisadas ?? 0
  const activas = stats?.pendientes ?? displayData.length

  const donutData = [
    { name: 'Crítica', value: displayData.filter(a => a.severidad === 'CRÍTICA').length, color: RISK_COLORS['CRÍTICO'] },
    { name: 'Alta',    value: displayData.filter(a => a.severidad === 'ALTA').length,    color: RISK_COLORS['ALTO'] },
    { name: 'Media',   value: displayData.filter(a => a.severidad === 'MEDIA').length,   color: RISK_COLORS['MEDIO'] },
    { name: 'Baja',    value: displayData.filter(a => a.severidad === 'BAJA').length,    color: RISK_COLORS['BAJO'] },
  ]

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Alertas</h1>
          <p className="text-sm text-slate-500 mt-0.5">Monitorea, prioriza y gestiona alertas automáticas de opacidad detectadas en procesos contractuales.</p>
        </div>

        <SearchBox placeholder="Buscar por entidad, proceso o tipo de alerta" value={search} onChange={setSearch} className="max-w-xl" />

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Tipo de alerta</label>
              <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 bg-white outline-none focus:border-blue-400">
                <option value="">Todos</option>
                {tiposDisponibles.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Estado</label>
              <select value={alertasFilters.estado ?? ''} onChange={(e) => setAlertasFilters({ estado: e.target.value || undefined })} className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 bg-white outline-none focus:border-blue-400">
                <option value="">Todos</option>
                {(['NUEVA', 'EN_REVISION', 'EN_SEGUIMIENTO', 'RESUELTA'] as const).map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Departamento</label>
              <select value={alertasFilters.departamento ?? ''} onChange={(e) => setAlertasFilters({ departamento: e.target.value || undefined })} className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 bg-white outline-none focus:border-blue-400">
                <option value="">Todos</option>
                {(departamentos ?? []).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Fecha desde</label>
              <input type="date" value={alertasFilters.fechaDesde ?? ''} onChange={(e) => setAlertasFilters({ fechaDesde: e.target.value || undefined })} className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Fecha hasta</label>
              <input type="date" value={alertasFilters.fechaHasta ?? ''} onChange={(e) => setAlertasFilters({ fechaHasta: e.target.value || undefined })} className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 outline-none focus:border-blue-400" />
            </div>
            <button onClick={handleLimpiar} className="px-3 py-2 text-sm text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5">
              <span>✕</span> Limpiar filtros
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard title="Alertas activas" value={activas} subtitle="Requieren revisión" icon={Bell} iconBg="bg-blue-50" iconColor="text-blue-500" />
          <KPICard title="Críticas" value={stats?.riesgo_critico ?? criticas} subtitle="Prioridad inmediata" icon={AlertTriangle} iconBg="bg-red-50" iconColor="text-red-500" valueColor="text-red-600" />
          <KPICard title="En seguimiento" value={enSeguimiento} subtitle="Con revisión en curso" icon={Clock} iconBg="bg-orange-50" iconColor="text-orange-500" />
          <KPICard title="Resueltas" value={resueltas} subtitle="Cerradas en el periodo" icon={CheckCircle} iconBg="bg-green-50" iconColor="text-green-500" />
        </div>

        <div className="flex items-center justify-between border-b border-slate-200">
          <div className="flex">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                {tab.label}
                {tab.id === 'criticas' && (stats?.riesgo_critico ?? criticas) > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full">
                  {stats?.riesgo_critico ?? criticas}
                </span>
              )}
              </button>
            ))}
          </div>
          <button onClick={handleExportar} disabled={exportando} className="mb-2 flex items-center gap-2 px-3 py-1.5 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 disabled:opacity-60">
            {exportando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Exportar
          </button>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          isLoading={isLoading}
          onRowClick={setSelected}
          selectedItem={selected}
          keyExtractor={(a) => a.id}
          pagination={alertas ? { page: alertas.page, limit: alertas.limit, total: alertas.total, onPageChange: (p) => setAlertasFilters({ page: p }) } : undefined}
        />
      </div>

      {selected && (
        <aside className="w-72 shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 sticky top-6">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-xs text-slate-400 mb-0.5">Detalle de la alerta</p>
                <h3 className="text-sm font-semibold text-slate-800 leading-snug">{selected.descripcion}</h3>
                <span className={`inline-block mt-1.5 px-2 py-0.5 text-xs font-semibold rounded-full border ${PRIORIDAD_COLOR[selected.riesgo] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  Prioridad {selected.riesgo.toLowerCase()}
                </span>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-xs shrink-0">✕</button>
            </div>

            <div className="space-y-1 text-xs text-slate-500">
              <p><strong className="text-slate-600">Entidad:</strong> {selected.entidad}</p>
              <p><strong className="text-slate-600">Departamento:</strong> {selected.departamento || '—'}</p>
              <p><strong className="text-slate-600">Proceso:</strong> <span className="font-mono text-blue-600">{selected.idProceso}</span></p>
              <p><strong className="text-slate-600">Tipo:</strong> {selected.tipo}</p>
              <p><strong className="text-slate-600">Fecha:</strong> {selected.fechaDeteccion ? formatDate(selected.fechaDeteccion) : '—'}</p>
              <p><strong className="text-slate-600">Estado:</strong> <StatusBadge status={selected.estado} /></p>
            </div>

            <ScoreCircle score={selected.scoreRiesgo} riskCategory={selected.riesgo} />

            {selected.flags.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1.5">Señales asociadas</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.flags.map((f) => (
                    <span key={f} className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-100 rounded-full text-xs">{flagLabel(f)}</span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1.5">Acciones sugeridas</p>
              <ol className="space-y-1">
                {selected.accionesSugeridas.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="font-bold text-blue-500 shrink-0">{i + 1}.</span> {a}
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => navigate(`/analisis/${encodeURIComponent(selected.id)}`)}
                className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 text-white text-xs rounded-lg font-medium hover:bg-blue-700"
              >
                <Brain className="w-3.5 h-3.5" /> Analizar con IA
              </button>
              <a
                href={`https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeGuid=${selected.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 border border-slate-200 text-slate-600 text-xs rounded-lg font-medium hover:bg-slate-50"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Ver proceso en SECOP
              </a>
              <button
                onClick={() => marcarRevisada(selected.id)}
                disabled={marcando || selected.estado === 'RESUELTA'}
                className="w-full flex items-center justify-center gap-2 py-2 border border-slate-200 text-slate-600 text-xs rounded-lg font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                {marcando ? 'Marcando...' : selected.estado === 'RESUELTA' ? 'Ya revisada' : 'Marcar como revisada'}
              </button>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Distribución de alertas</p>
              <DonutChart data={donutData} total={displayData.length} centerLabel="alertas" />
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}
