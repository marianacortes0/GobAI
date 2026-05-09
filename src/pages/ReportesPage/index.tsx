import { useMemo, useState } from 'react'
import { BarChart3, Calendar, Download, Share2, Clock, FileText, Loader, AlertCircle } from 'lucide-react'
import { KPICard } from '@/components/common/KPICard'
import { ScoreCircle } from '@/components/common/ScoreCircle'
import { DonutChart } from '@/components/charts/DonutChart'
import { HorizontalBarChart } from '@/components/charts/HorizontalBarChart'
import { LineChart } from '@/components/charts/LineChart'
import { RISK_COLORS, DEPARTAMENTOS } from '@/utils/constants'
import { formatDate, formatCurrency } from '@/utils/formatters'
import { useReportes, useReporteStats, useGenerarReporte } from '@/hooks/useReportes'
import { useDashboardStats } from '@/hooks/useDashboard'
import { useAlertaStats, useAlertas } from '@/hooks/useAlertas'
import { reportesService } from '@/services/reportes.service'
import type { ReportType, ReportFormat, ReportPeriod } from '@/types/reporte.types'

type TabId = 'resumen' | 'contratacion' | 'alertas' | 'ia' | 'historico'

const MES_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

function mesLabel(key: string): string {
  const m = key.match(/(\d{4})-(\d{2})/)
  if (!m) return key
  const idx = Math.max(0, Math.min(11, parseInt(m[2], 10) - 1))
  return `${MES_LABELS[idx]} ${m[1].slice(2)}`
}

export function ReportesPage() {
  const [activeTab, setActiveTab] = useState<TabId>('resumen')
  const [tipo, setTipo] = useState<ReportType>('CONTRATACION')
  const [periodo, setPeriodo] = useState<ReportPeriod>('MES')
  const [departamento, setDepartamento] = useState('')
  const [formato, setFormato] = useState<ReportFormat>('PDF')
  const [descargando, setDescargando] = useState(false)
  const [copiado, setCopiado] = useState(false)
  const [lastReporteId, setLastReporteId] = useState<number | null>(null)
  const [lastReporteFormato, setLastReporteFormato] = useState<ReportFormat | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const { data: stats, isLoading: statsLoading } = useReporteStats()
  const { data: reportesData } = useReportes()
  const { data: dashboard, isLoading: dashboardLoading } = useDashboardStats()
  const { data: alertaStats } = useAlertaStats()
  const { data: alertasList } = useAlertas({ limit: 5 })
  const { mutate: generarReporte, isPending: generando } = useGenerarReporte()

  const handleGenerar = () => {
    setErrorMsg(null)
    const nombre = `Reporte ${tipo} - ${periodo} ${new Date().toLocaleDateString('es-CO')}`
    generarReporte(
      { nombre, tipo, formato, periodo, cobertura: departamento || undefined },
      {
        onSuccess: (r) => {
          setLastReporteId(r.id)
          setLastReporteFormato(r.formato)
          setActiveTab('historico')
        },
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : 'No se pudo generar el reporte.'
          setErrorMsg(message)
        },
      }
    )
  }

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDescargar = async () => {
    setDescargando(true)
    setErrorMsg(null)
    try {
      if (lastReporteId) {
        const blob = await reportesService.descargar(lastReporteId)
        const ext = (lastReporteFormato ?? formato).toLowerCase()
        triggerDownload(blob, `reporte_${lastReporteId}.${ext}`)
      } else {
        const blob = await reportesService.descargarExcel()
        triggerDownload(blob, 'reporte_gobia.xlsx')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al descargar el reporte.'
      setErrorMsg(message)
    } finally {
      setDescargando(false)
    }
  }

  const handleDescargarItem = async (id: number, fmt: ReportFormat) => {
    try {
      const blob = await reportesService.descargar(id)
      triggerDownload(blob, `reporte_${id}.${fmt.toLowerCase()}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al descargar el reporte.'
      setErrorMsg(message)
    }
  }

  const handleCompartir = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const distribucion = dashboard?.distribucionRiesgo ?? { critico: 0, alto: 0, medio: 0, bajo: 0 }
  const totalContratos = dashboard?.totalContratos ?? 0
  const totalDistribucion = distribucion.critico + distribucion.alto + distribucion.medio + distribucion.bajo

  const donutData = useMemo(() => ([
    { name: 'Crítico', value: distribucion.critico, color: RISK_COLORS['CRÍTICO'] },
    { name: 'Alto', value: distribucion.alto, color: RISK_COLORS['ALTO'] },
    { name: 'Medio', value: distribucion.medio, color: RISK_COLORS['MEDIO'] },
    { name: 'Bajo', value: distribucion.bajo, color: RISK_COLORS['BAJO'] },
  ]), [distribucion.critico, distribucion.alto, distribucion.medio, distribucion.bajo])

  const evolucionData = useMemo(() => {
    const map = dashboard?.contratosPorMes ?? {}
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([k, v]) => ({ mes: mesLabel(k), contratos: v }))
  }, [dashboard?.contratosPorMes])

  const totalAlertas = alertaStats?.total ?? 0
  const alertasRevisadasPct = totalAlertas > 0
    ? Math.round(((alertaStats?.revisadas ?? 0) / totalAlertas) * 100)
    : 0
  const riesgoAltoPct = totalDistribucion > 0
    ? Math.round(((distribucion.alto + distribucion.critico) / totalDistribucion) * 100)
    : 0

  const indicadores = useMemo(() => ([
    { nombre: 'Contratos en riesgo alto/crítico', value: riesgoAltoPct, max: 100, color: '#EF4444' },
    { nombre: 'Alertas revisadas', value: alertasRevisadasPct, max: 100, color: '#10B981' },
    { nombre: 'Confianza del modelo IA', value: 91, max: 100, color: '#3B82F6' },
    { nombre: 'Cobertura SECOP II', value: 96, max: 100, color: '#8B5CF6' },
    { nombre: 'Entidades monitoreadas', value: dashboard?.entidadesMonitoreadas ?? 0, max: Math.max(50, (dashboard?.entidadesMonitoreadas ?? 0)), color: '#F59E0B' },
  ]), [riesgoAltoPct, alertasRevisadasPct, dashboard?.entidadesMonitoreadas])

  const topEntidades = dashboard?.topEntidadesRiesgo ?? []
  const maxEntidadContratos = topEntidades.reduce((m, e) => Math.max(m, e.cantidad_contratos), 1)

  const hallazgos = useMemo(() => topEntidades.slice(0, 3).map((e, i) => ({
    titulo: `Concentración de riesgo en ${e.nombre}`,
    descripcion: `${e.cantidad_contratos} contratos · score promedio ${Math.round(e.score_promedio)}/100 · ${formatCurrency(e.valor_total)}`,
    prioridad: i + 1,
  })), [topEntidades])

  const insights = useMemo(() => ([
    {
      titulo: 'Concentración de riesgo',
      descripcion: topEntidades[0]
        ? `${topEntidades[0].nombre} acumula ${topEntidades[0].cantidad_contratos} contratos con score ${Math.round(topEntidades[0].score_promedio)}/100.`
        : 'No hay datos suficientes para calcular concentración.',
    },
    {
      titulo: 'Volumen total',
      descripcion: `${totalContratos.toLocaleString('es-CO')} contratos analizados · ${formatCurrency(dashboard?.presupuestoTotal ?? 0)} en presupuesto.`,
    },
    {
      titulo: 'Riesgo agregado',
      descripcion: `${distribucion.critico + distribucion.alto} contratos en categoría alto/crítico (${riesgoAltoPct}% del total clasificado).`,
    },
    {
      titulo: 'Alertas activas',
      descripcion: `${alertaStats?.pendientes ?? 0} pendientes de ${totalAlertas} totales · ${alertaStats?.riesgo_critico ?? 0} críticas.`,
    },
  ]), [topEntidades, totalContratos, dashboard?.presupuestoTotal, distribucion, riesgoAltoPct, alertaStats, totalAlertas])

  const resumenPeriodoTexto = useMemo(() => {
    const cobertura = departamento || 'todos los departamentos'
    if (totalContratos === 0) {
      return `Aún no hay datos consolidados para ${cobertura} en el período ${periodo.toLowerCase()}.`
    }
    const top = topEntidades[0]
    const concentracion = top
      ? ` Se observa concentración en ${top.nombre}, con score promedio ${Math.round(top.score_promedio)}/100.`
      : ''
    return `Durante el período ${periodo.toLowerCase()} se analizaron ${totalContratos.toLocaleString('es-CO')} contratos en ${cobertura}, con presupuesto total de ${formatCurrency(dashboard?.presupuestoTotal ?? 0)}. ${distribucion.critico + distribucion.alto} contratos (${riesgoAltoPct}%) presentan riesgo alto o crítico.${concentracion}`
  }, [departamento, periodo, totalContratos, topEntidades, dashboard?.presupuestoTotal, distribucion.critico, distribucion.alto, riesgoAltoPct])

  const conclusion = useMemo(() => {
    if ((alertaStats?.riesgo_critico ?? 0) > 0) {
      return `Atención inmediata: ${alertaStats?.riesgo_critico} alertas críticas activas. Se recomienda priorizar auditoría sobre ${topEntidades[0]?.nombre ?? 'las entidades de mayor riesgo'}.`
    }
    if (riesgoAltoPct >= 25) {
      return `Riesgo agregado elevado (${riesgoAltoPct}% de contratos en categoría alta/crítica). Revisar concentraciones por entidad y modalidad.`
    }
    return 'Sin hallazgos críticos relevantes en el período. Continuar monitoreo periódico.'
  }, [alertaStats?.riesgo_critico, riesgoAltoPct, topEntidades])

  const tabs: { id: TabId; label: string }[] = [
    { id: 'resumen', label: 'Resumen ejecutivo' },
    { id: 'contratacion', label: 'Contratación' },
    { id: 'alertas', label: 'Alertas' },
    { id: 'ia', label: 'Análisis IA' },
    { id: 'historico', label: 'Histórico' },
  ]

  const reportesList = reportesData?.data ?? []
  const coberturaActual = departamento || 'Todos'

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0 space-y-5">
        <h1 className="text-xl font-bold text-slate-800">Reportes</h1>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Tipo</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value as ReportType)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white outline-none focus:border-blue-400">
                <option value="CONTRATACION">CONTRATACIÓN</option>
                <option value="ENTIDAD">ENTIDAD</option>
                <option value="RIESGO">RIESGO</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Período</label>
              <select value={periodo} onChange={(e) => setPeriodo(e.target.value as ReportPeriod)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white outline-none focus:border-blue-400">
                <option value="SEMANA">SEMANA</option>
                <option value="MES">MES</option>
                <option value="TRIMESTRE">TRIMESTRE</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Departamento</label>
              <select value={departamento} onChange={(e) => setDepartamento(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white outline-none focus:border-blue-400">
                <option value="">Todos</option>
                {DEPARTAMENTOS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Formato</label>
              <select value={formato} onChange={(e) => setFormato(e.target.value as ReportFormat)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white outline-none focus:border-blue-400">
                <option value="PDF">PDF</option>
                <option value="XLSX">XLSX</option>
              </select>
            </div>
            <button
              type="button"
              disabled
              title="Programación no disponible en esta versión del API"
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-400 text-sm rounded-lg cursor-not-allowed"
            >
              <Calendar className="w-4 h-4" /> Programar
            </button>
            <button
              onClick={handleGenerar}
              disabled={generando}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60"
            >
              {generando ? <Loader className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
              {generando ? 'Generando...' : 'Generar reporte'}
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <p className="text-xs text-slate-500 font-medium mr-1">Cobertura:</p>
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100">{coberturaActual}</span>
            <span className="px-2.5 py-0.5 bg-slate-50 text-slate-600 text-xs rounded-full border border-slate-200">{tipo}</span>
            <span className="px-2.5 py-0.5 bg-slate-50 text-slate-600 text-xs rounded-full border border-slate-200">{periodo}</span>
            <span className="px-2.5 py-0.5 bg-slate-50 text-slate-600 text-xs rounded-full border border-slate-200">{formato}</span>
          </div>
          {errorMsg && (
            <div className="mt-3 flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4" /> {errorMsg}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
            ))
          ) : (
            <>
              <KPICard title="Reportes generados" value={stats?.generados ?? 0} icon={FileText} />
              <KPICard title="Programados" value={stats?.programados ?? 0} icon={Clock} iconBg="bg-orange-50" iconColor="text-orange-500" />
              <KPICard title="Descargas" value={stats?.descargas ?? 0} icon={Download} iconBg="bg-green-50" iconColor="text-green-500" />
              <KPICard title="Riesgo promedio" value={`${(stats?.riesgoPromedio ?? 0).toFixed(1)}/100`} icon={BarChart3} iconBg="bg-red-50" iconColor="text-red-500" valueColor="text-red-600" />
            </>
          )}
        </div>

        <div className="flex border-b border-slate-200">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-6">
          {activeTab === 'resumen' && (
            <>
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Resumen del período</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{resumenPeriodoTexto}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Indicadores clave</h3>
                {dashboardLoading ? (
                  <div className="h-32 bg-slate-100 rounded-lg animate-pulse" />
                ) : (
                  <HorizontalBarChart data={indicadores.map(i => ({ label: i.nombre, value: i.value, max: i.max, color: i.color }))} showPercent />
                )}
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Distribución de riesgo</h3>
                  {totalDistribucion === 0 ? (
                    <p className="text-xs text-slate-400 py-8 text-center">Sin datos de distribución.</p>
                  ) : (
                    <DonutChart data={donutData} total={totalContratos || totalDistribucion} centerLabel="contratos" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Evolución de contratos</h3>
                  {evolucionData.length === 0 ? (
                    <p className="text-xs text-slate-400 py-8 text-center">Sin histórico mensual.</p>
                  ) : (
                    <LineChart data={evolucionData} xKey="mes" yKey="contratos" color="#3B82F6" label="Contratos" />
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Hallazgos priorizados</h3>
                {hallazgos.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">Sin hallazgos identificados.</p>
                ) : (
                  <ol className="space-y-2">
                    {hallazgos.map(h => (
                      <li key={h.prioridad} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center shrink-0">{h.prioridad}</span>
                        <div>
                          <p className="text-sm font-medium text-slate-700">{h.titulo}</p>
                          <p className="text-xs text-slate-500">{h.descripcion}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Top entidades por riesgo</h3>
                {topEntidades.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">Sin entidades para mostrar.</p>
                ) : (
                  <HorizontalBarChart data={topEntidades.slice(0, 5).map(e => ({ label: e.nombre, value: e.cantidad_contratos, max: maxEntidadContratos, color: '#F97316' }))} />
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {insights.map((ins, i) => (
                  <div key={i} className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <p className="text-xs font-semibold text-blue-700 mb-1">{ins.titulo}</p>
                    <p className="text-xs text-slate-600">{ins.descripcion}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'contratacion' && (
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-slate-700">Contratación en {coberturaActual}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Total contratos</p>
                  <p className="text-xl font-bold text-slate-800">{totalContratos.toLocaleString('es-CO')}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Presupuesto</p>
                  <p className="text-xl font-bold text-slate-800">{formatCurrency(dashboard?.presupuestoTotal ?? 0)}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Riesgo alto</p>
                  <p className="text-xl font-bold text-red-600">{distribucion.alto + distribucion.critico}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Entidades</p>
                  <p className="text-xl font-bold text-slate-800">{dashboard?.entidadesMonitoreadas ?? 0}</p>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Top entidades por presupuesto</h4>
                {(dashboard?.topEntidadesPresupuesto ?? []).length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">Sin datos.</p>
                ) : (
                  <div className="space-y-2">
                    {(dashboard?.topEntidadesPresupuesto ?? []).slice(0, 5).map(e => (
                      <div key={e.nit} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-700 truncate">{e.nombre}</p>
                          <p className="text-xs text-slate-400">{e.cantidad_contratos} contratos · score {Math.round(e.score_promedio)}</p>
                        </div>
                        <span className="text-sm font-semibold text-slate-700">{formatCurrency(e.valor_total)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'alertas' && (
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-slate-700">Alertas activas</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Total</p>
                  <p className="text-xl font-bold text-slate-800">{totalAlertas.toLocaleString('es-CO')}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Pendientes</p>
                  <p className="text-xl font-bold text-orange-600">{alertaStats?.pendientes ?? 0}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Revisadas</p>
                  <p className="text-xl font-bold text-green-600">{alertaStats?.revisadas ?? 0}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Críticas</p>
                  <p className="text-xl font-bold text-red-600">{alertaStats?.riesgo_critico ?? 0}</p>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Últimas alertas</h4>
                {(alertasList?.data ?? []).length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">Sin alertas registradas.</p>
                ) : (
                  <div className="space-y-2">
                    {(alertasList?.data ?? []).slice(0, 5).map(a => (
                      <div key={a.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-slate-700 truncate">{a.entidad || 'Sin entidad'}</p>
                          <span className="text-xs font-semibold text-red-600">{a.scoreRiesgo}/100</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">{a.descripcion}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'ia' && (
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-slate-700">Análisis IA agregado</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Riesgo promedio</p>
                  <p className="text-xl font-bold text-slate-800">{(stats?.riesgoPromedio ?? 0).toFixed(1)}/100</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Confianza modelo</p>
                  <p className="text-xl font-bold text-blue-600">91%</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Contratos analizados</p>
                  <p className="text-xl font-bold text-slate-800">{totalContratos.toLocaleString('es-CO')}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Riesgo crítico</p>
                  <p className="text-xl font-bold text-red-600">{distribucion.critico}</p>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Insights del modelo</h4>
                <div className="grid grid-cols-2 gap-3">
                  {insights.map((ins, i) => (
                    <div key={i} className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                      <p className="text-xs font-semibold text-blue-700 mb-1">{ins.titulo}</p>
                      <p className="text-xs text-slate-600">{ins.descripcion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'historico' && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Reportes generados</h3>
              {reportesList.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No hay reportes generados aún.</p>
              ) : (
                <div className="space-y-2">
                  {reportesList.map(r => (
                    <div key={r.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{r.nombre}</p>
                        <p className="text-xs text-slate-400">{r.tipo} · {r.periodo} · {r.formato} · {formatDate(r.fechaGeneracion)}{r.cobertura ? ` · ${r.cobertura}` : ''}</p>
                      </div>
                      <button
                        onClick={() => handleDescargarItem(r.id, r.formato)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" /> Descargar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <aside className="w-72 shrink-0">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 sticky top-6">
          <h3 className="text-sm font-semibold text-slate-700">Detalle del reporte</h3>
          <div className="space-y-1.5 text-xs text-slate-600">
            <p><strong>Tipo:</strong> {tipo}</p>
            <p><strong>Período:</strong> {periodo}</p>
            <p><strong>Formato:</strong> {formato}</p>
            <p><strong>Cobertura:</strong> {coberturaActual}</p>
            {lastReporteId && <p><strong>Último ID:</strong> #{lastReporteId}</p>}
          </div>
          <ScoreCircle score={Math.round(stats?.riesgoPromedio ?? 0)} size="md" />
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Conclusión</p>
            <p className="text-xs text-slate-600 leading-relaxed">{conclusion}</p>
          </div>
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <button
              onClick={handleDescargar}
              disabled={descargando}
              className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 text-white text-xs rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60"
            >
              {descargando ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              {descargando
                ? 'Descargando...'
                : lastReporteId
                  ? `Descargar reporte #${lastReporteId}`
                  : 'Descargar Excel consolidado'}
            </button>
            <button
              onClick={handleCompartir}
              className={`w-full flex items-center justify-center gap-2 py-2 border text-xs rounded-lg font-medium transition-colors ${copiado ? 'border-green-300 bg-green-50 text-green-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <Share2 className="w-3.5 h-3.5" /> {copiado ? '¡URL copiada!' : 'Compartir'}
            </button>
          </div>
          {reportesList.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Historial de exportación</p>
              <div className="space-y-1.5">
                {reportesList.slice(0, 3).map(r => (
                  <div key={r.id} className="flex items-center justify-between text-xs text-slate-500">
                    <span>{formatDate(r.fechaGeneracion)} — {r.formato}</span>
                    <span className="text-slate-400">{r.usuarioNombre?.split(' ')[0] ?? '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
