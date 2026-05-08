import { useState } from 'react'
import { Bell, AlertTriangle, Clock, CheckCircle, ExternalLink, Brain } from 'lucide-react'
import { KPICard } from '@/components/common/KPICard'
import { SearchBox } from '@/components/common/SearchBox'
import { SeverityBadge } from '@/components/common/SeverityBadge'
import { StatusBadge } from '@/components/common/StatusBadge'
import { ScoreCircle } from '@/components/common/ScoreCircle'
import { DataTable, type Column } from '@/components/common/DataTable'
import { DonutChart } from '@/components/charts/DonutChart'
import { useAlertas, useAlertaStats, useMarcarRevisada } from '@/hooks/useAlertas'
import { useDebounce } from '@/hooks/useDebounce'
import { RISK_COLORS } from '@/utils/constants'
import { formatDate } from '@/utils/formatters'
import type { Alerta } from '@/types/alerta.types'
import type { Severity } from '@/types/shared.types'

const TIPOS_ALERTA = ['Concentración de proveedor', 'Urgencia injustificada', 'Fraccionamiento', 'Precio inusual', 'Proponente único', 'Justificación débil']

const MOCK_ALERTAS: Alerta[] = [
  { id: '1', tipo: 'Concentración de proveedor', severidad: 'CRÍTICA', estado: 'NUEVA', entidad: 'Gobernación Antioquia', idProceso: 'SN-2024-002891', senalDetectada: 'Proponente único repetido', descripcion: 'El mismo proveedor ha ganado 8 contratos consecutivos sin competencia real.', fechaDeteccion: '2024-02-15', departamento: 'Antioquia', municipio: 'Medellín', scoreRiesgo: 89, riesgo: 'CRÍTICO', accionesSugeridas: ['Solicitar explicación técnica', 'Verificar inhabilidades', 'Escalar a Procuraduría'] },
  { id: '2', tipo: 'Urgencia injustificada', severidad: 'ALTA', estado: 'EN_REVISION', entidad: 'Alcaldía de Bogotá', idProceso: 'SN-2024-001234', senalDetectada: 'Urgencia declarada sin soporte', descripcion: 'Se declaró urgencia manifiesta sin evidencia documental.', fechaDeteccion: '2024-02-12', departamento: 'Cundinamarca', municipio: 'Bogotá', scoreRiesgo: 74, riesgo: 'ALTO', accionesSugeridas: ['Revisar acto administrativo', 'Verificar soporte de urgencia'] },
  { id: '3', tipo: 'Fraccionamiento', severidad: 'ALTA', estado: 'EN_SEGUIMIENTO', entidad: 'IDU Bogotá', idProceso: 'SN-2024-005678', senalDetectada: 'División artificial del contrato', descripcion: 'Contrato dividido en 4 partes para evadir licitación.', fechaDeteccion: '2024-02-10', departamento: 'Cundinamarca', municipio: 'Bogotá', scoreRiesgo: 78, riesgo: 'ALTO', accionesSugeridas: ['Consolidar contratos relacionados', 'Auditar proceso'] },
  { id: '4', tipo: 'Precio inusual', severidad: 'MEDIA', estado: 'RESUELTA', entidad: 'SENA', idProceso: 'SN-2024-003456', senalDetectada: 'Precio 35% por encima del mercado', descripcion: 'Precios superiores al promedio de mercado detectados.', fechaDeteccion: '2024-01-30', departamento: 'Valle del Cauca', municipio: 'Cali', scoreRiesgo: 52, riesgo: 'MEDIO', accionesSugeridas: ['Análisis de precios', 'Comparar estudios de mercado'] },
]

const PRIORIDAD_COLOR: Record<string, string> = {
  'CRÍTICO': 'bg-red-100 text-red-700 border-red-200',
  'ALTO': 'bg-orange-100 text-orange-700 border-orange-200',
  'MEDIO': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'BAJO': 'bg-green-100 text-green-700 border-green-200',
}

type TabId = 'todas' | 'criticas' | 'seguimiento' | 'resueltas'

export function AlertasPage() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<TabId>('todas')
  const [selected, setSelected] = useState<Alerta | null>(null)
  const [filterTipo, setFilterTipo] = useState('')
  const [filterSeveridad, setFilterSeveridad] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const debouncedSearch = useDebounce(search)

  const { data: alertas, isLoading } = useAlertas({ search: debouncedSearch })
  const { data: stats } = useAlertaStats()
  const { mutate: marcarRevisada, isPending: marcando } = useMarcarRevisada()
  const displayData = alertas?.data ?? MOCK_ALERTAS

  const tabs: { id: TabId; label: string }[] = [
    { id: 'todas', label: 'Todas' },
    { id: 'criticas', label: 'Críticas' },
    { id: 'seguimiento', label: 'En seguimiento' },
    { id: 'resueltas', label: 'Resueltas' },
  ]

  const filtered = displayData.filter(a => {
    if (activeTab === 'criticas') return a.severidad === 'CRÍTICA'
    if (activeTab === 'seguimiento') return a.estado === 'EN_SEGUIMIENTO'
    if (activeTab === 'resueltas') return a.estado === 'RESUELTA'
    return true
  }).filter(a => {
    if (filterTipo && a.tipo !== filterTipo) return false
    if (filterSeveridad && a.severidad !== filterSeveridad) return false
    if (filterEstado && a.estado !== filterEstado) return false
    return true
  })

  function handleLimpiar() {
    setFilterTipo('')
    setFilterSeveridad('')
    setFilterEstado('')
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

  const criticas = filtered.filter(a => a.severidad === 'CRÍTICA').length
  const enSeguimiento = filtered.filter(a => a.estado === 'EN_SEGUIMIENTO').length
  const resueltas = stats?.revisadas ?? displayData.filter(a => a.estado === 'RESUELTA').length
  const activas = stats?.pendientes ?? displayData.filter(a => a.estado !== 'RESUELTA').length

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
          <p className="text-sm text-slate-500 mt-0.5">Monitorea y gestiona señales de riesgo detectadas automáticamente en procesos contractuales</p>
        </div>

        <SearchBox placeholder="Buscar por entidad, proceso, proveedor o tipo..." value={search} onChange={setSearch} className="max-w-xl" />

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Tipo de alerta</label>
              <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 bg-white outline-none focus:border-blue-400">
                <option value="">Todos</option>
                {TIPOS_ALERTA.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Severidad</label>
              <select value={filterSeveridad} onChange={(e) => setFilterSeveridad(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 bg-white outline-none focus:border-blue-400">
                <option value="">Todas</option>
                {(['CRÍTICA', 'ALTA', 'MEDIA', 'BAJA'] as const).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Estado</label>
              <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 bg-white outline-none focus:border-blue-400">
                <option value="">Todos</option>
                {(['NUEVA', 'EN_REVISION', 'EN_SEGUIMIENTO', 'RESUELTA'] as const).map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
            <button onClick={handleLimpiar} className="px-3 py-2 text-sm text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5">
              <span>✕</span> Limpiar filtros
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard title="Alertas activas" value={activas} icon={Bell} iconBg="bg-blue-50" iconColor="text-blue-500" />
          <KPICard title="Críticas" value={stats?.riesgo_critico ?? criticas} icon={AlertTriangle} iconBg="bg-red-50" iconColor="text-red-500" valueColor="text-red-600" />
          <KPICard title="En seguimiento" value={enSeguimiento} icon={Clock} iconBg="bg-orange-50" iconColor="text-orange-500" />
          <KPICard title="Resueltas" value={resueltas} icon={CheckCircle} iconBg="bg-green-50" iconColor="text-green-500" />
        </div>

        <div className="flex border-b border-slate-200">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
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

        <DataTable columns={columns} data={filtered} isLoading={isLoading} onRowClick={setSelected} selectedItem={selected} keyExtractor={(a) => a.id} />
      </div>

      {selected && (
        <aside className="w-72 shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 sticky top-6">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-xs text-slate-400 mb-0.5">Detalle de la alerta</p>
                <h3 className="text-sm font-semibold text-slate-800 leading-snug">{selected.senalDetectada}</h3>
                <span className={`inline-block mt-1.5 px-2 py-0.5 text-xs font-semibold rounded-full border ${PRIORIDAD_COLOR[selected.riesgo] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  Prioridad {selected.riesgo.toLowerCase()}
                </span>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-xs shrink-0">✕</button>
            </div>

            <div className="space-y-1 text-xs text-slate-500">
              <p><strong className="text-slate-600">Entidad:</strong> {selected.entidad}</p>
              <p><strong className="text-slate-600">Departamento:</strong> {selected.departamento}</p>
              {selected.municipio && <p><strong className="text-slate-600">Municipio:</strong> {selected.municipio}</p>}
              <p><strong className="text-slate-600">Proceso:</strong> <span className="font-mono text-blue-600">{selected.idProceso}</span></p>
            </div>

            <ScoreCircle score={selected.scoreRiesgo} riskCategory={selected.riesgo} />

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Descripción</p>
              <p className="text-xs text-slate-600 leading-relaxed">{selected.descripcion}</p>
            </div>

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
              <button className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 text-white text-xs rounded-lg font-medium hover:bg-blue-700">
                <Brain className="w-3.5 h-3.5" /> Analizar con IA
              </button>
              <a
                href="https://community.secop.gov.co/STS/Users/Login/Index?SkinName=CCE&currentLanguage=es-CO&Page=login&Country=CO"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 border border-slate-200 text-slate-600 text-xs rounded-lg font-medium hover:bg-slate-50"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Ver en SECOP
              </a>
              <button
                onClick={() => marcarRevisada(selected.id)}
                disabled={marcando || selected.estado === 'RESUELTA'}
                className="w-full flex items-center justify-center gap-2 py-2 border border-slate-200 text-slate-600 text-xs rounded-lg font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                {marcando ? 'Marcando...' : selected.estado === 'RESUELTA' ? 'Ya revisada' : 'Marcar revisada'}
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
