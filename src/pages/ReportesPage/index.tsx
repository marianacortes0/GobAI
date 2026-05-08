import { useState } from 'react'
import { BarChart3, Calendar, Download, Share2, Clock, FileText, Loader } from 'lucide-react'
import { KPICard } from '@/components/common/KPICard'
import { ScoreCircle } from '@/components/common/ScoreCircle'
import { DonutChart } from '@/components/charts/DonutChart'
import { HorizontalBarChart } from '@/components/charts/HorizontalBarChart'
import { LineChart } from '@/components/charts/LineChart'
import { RISK_COLORS, DEPARTAMENTOS } from '@/utils/constants'
import { formatDate } from '@/utils/formatters'
import { useReportes, useReporteStats, useGenerarReporte } from '@/hooks/useReportes'
import { reportesService } from '@/services/reportes.service'
import type { ReportType, ReportFormat, ReportPeriod } from '@/types/reporte.types'

type TabId = 'resumen' | 'contratacion' | 'alertas' | 'ia' | 'historico'

const MOCK_REPORTE = {
  resumenPeriodo: 'Durante el período analizado se identificaron patrones preocupantes de concentración de proveedores en el sector de infraestructura, con 3 empresas acaparando el 67% de los contratos de mayor cuantía. El índice de riesgo promedio aumentó 2.3 puntos respecto al trimestre anterior.',
  indicadores: [
    { nombre: 'Contratos con riesgo alto', value: 34, max: 100, color: '#EF4444' },
    { nombre: 'Alertas resueltas', value: 78, max: 100, color: '#10B981' },
    { nombre: 'Confianza del modelo IA', value: 91, max: 100, color: '#3B82F6' },
    { nombre: 'Cobertura SECOP II', value: 96, max: 100, color: '#8B5CF6' },
    { nombre: 'Entidades monitoreadas', value: 88, max: 100, color: '#F59E0B' },
  ],
  evolucionRiesgo: [
    { semana: 'Sem 1', score: 58 }, { semana: 'Sem 2', score: 62 },
    { semana: 'Sem 3', score: 71 }, { semana: 'Sem 4', score: 65 },
    { semana: 'Sem 5', score: 74 }, { semana: 'Sem 6', score: 61 },
  ],
  alertasPorEntidad: [
    { entidad: 'Alcaldía Bogotá', cantidad: 8 },
    { entidad: 'Gobernación Antioquia', cantidad: 6 },
    { entidad: 'IDU Bogotá', cantidad: 5 },
    { entidad: 'Min. Salud', cantidad: 4 },
    { entidad: 'SENA', cantidad: 3 },
  ],
  hallazgos: [
    { titulo: 'Concentración proveedor Antioquia', descripcion: '3 empresas ganan 67% de contratos de infraestructura', prioridad: 1 },
    { titulo: 'Urgencias injustificadas Bogotá', descripcion: '12 contratos declarados de urgencia sin soporte', prioridad: 2 },
    { titulo: 'Fraccionamiento Valle del Cauca', descripcion: 'Patrón detectado en 5 entidades del departamento', prioridad: 3 },
  ],
  insights: [
    { titulo: 'Mayor concentración', descripcion: 'Infraestructura vial en Cundinamarca tiene el mayor índice', tipo: 'riesgo' },
    { titulo: 'Modalidad dominante', descripcion: 'Contratación Directa representa el 43% de alertas', tipo: 'patron' },
    { titulo: 'Patrón textual', descripcion: '"Urgencia manifiesta" aparece 34 veces sin justificación', tipo: 'texto' },
    { titulo: 'Acción sugerida', descripcion: 'Priorizar auditoría en 3 entidades con mayor riesgo acumulado', tipo: 'accion' },
  ],
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

  const { data: stats, isLoading: statsLoading } = useReporteStats()
  const { data: reportesData } = useReportes()
  const { mutate: generarReporte, isPending: generando } = useGenerarReporte()

  const handleGenerar = () => {
    const nombre = `Reporte ${tipo} - ${periodo} ${new Date().toLocaleDateString('es-CO')}`
    generarReporte(
      { nombre, tipo, formato, periodo, cobertura: departamento || undefined },
      { onSuccess: (r) => { setLastReporteId(r.id); setActiveTab('historico') } }
    )
  }

  const handleDescargar = async () => {
    setDescargando(true)
    try {
      let blob: Blob
      if (lastReporteId) {
        blob = await reportesService.descargar(lastReporteId)
      } else {
        blob = await reportesService.descargarExcel()
      }
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = lastReporteId ? `reporte_${lastReporteId}.xlsx` : 'reporte_gobia.xlsx'
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDescargando(false)
    }
  }

  const handleCompartir = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const donutData = [
    { name: 'Crítico', value: 12, color: RISK_COLORS['CRÍTICO'] },
    { name: 'Alto', value: 74, color: RISK_COLORS['ALTO'] },
    { name: 'Medio', value: 241, color: RISK_COLORS['MEDIO'] },
    { name: 'Bajo', value: 921, color: RISK_COLORS['BAJO'] },
  ]

  const tabs: { id: TabId; label: string }[] = [
    { id: 'resumen', label: 'Resumen ejecutivo' },
    { id: 'contratacion', label: 'Contratación' },
    { id: 'alertas', label: 'Alertas' },
    { id: 'ia', label: 'Análisis IA' },
    { id: 'historico', label: 'Histórico' },
  ]

  const reportesList = reportesData?.data ?? []

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
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50">
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
          <div className="mt-3 flex flex-wrap gap-2">
            <p className="text-xs text-slate-500 font-medium mr-1">Cobertura:</p>
            {['Contratos', 'Alertas', 'Análisis IA', 'Entidades', 'Histórico'].map(c => (
              <span key={c} className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100">{c}</span>
            ))}
          </div>
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
              <KPICard title="Riesgo promedio" value={`${stats?.riesgoPromedio ?? 0}/100`} icon={BarChart3} iconBg="bg-red-50" iconColor="text-red-500" valueColor="text-red-600" />
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
                <p className="text-sm text-slate-600 leading-relaxed">{MOCK_REPORTE.resumenPeriodo}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Indicadores clave</h3>
                <HorizontalBarChart data={MOCK_REPORTE.indicadores.map(i => ({ label: i.nombre, value: i.value, max: i.max, color: i.color }))} showPercent />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Distribución de riesgo</h3>
                  <DonutChart data={donutData} total={1248} centerLabel="contratos" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Evolución del riesgo</h3>
                  <LineChart data={MOCK_REPORTE.evolucionRiesgo} xKey="semana" yKey="score" color="#3B82F6" label="Score riesgo" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Hallazgos priorizados</h3>
                <ol className="space-y-2">
                  {MOCK_REPORTE.hallazgos.map(h => (
                    <li key={h.prioridad} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center shrink-0">{h.prioridad}</span>
                      <div>
                        <p className="text-sm font-medium text-slate-700">{h.titulo}</p>
                        <p className="text-xs text-slate-500">{h.descripcion}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Alertas por entidad</h3>
                <HorizontalBarChart data={MOCK_REPORTE.alertasPorEntidad.map(a => ({ label: a.entidad, value: a.cantidad, max: 10, color: '#F97316' }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {MOCK_REPORTE.insights.map((ins, i) => (
                  <div key={i} className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <p className="text-xs font-semibold text-blue-700 mb-1">{ins.titulo}</p>
                    <p className="text-xs text-slate-600">{ins.descripcion}</p>
                  </div>
                ))}
              </div>
            </>
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
                      <div>
                        <p className="text-sm font-medium text-slate-700">{r.nombre}</p>
                        <p className="text-xs text-slate-400">{r.tipo} · {r.periodo} · {r.formato} · {formatDate(r.fechaGeneracion)}</p>
                      </div>
                      <button
                        onClick={async () => {
                          const blob = await reportesService.descargar(r.id)
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = `reporte_${r.id}.${r.formato.toLowerCase()}`
                          a.click()
                          URL.revokeObjectURL(url)
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
                      >
                        <Download className="w-3.5 h-3.5" /> Descargar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab !== 'resumen' && activeTab !== 'historico' && (
            <div className="py-8 text-center text-slate-400 text-sm">
              Contenido de la pestaña {tabs.find(t => t.id === activeTab)?.label} disponible al generar un reporte.
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
            {departamento && <p><strong>Departamento:</strong> {departamento}</p>}
          </div>
          <ScoreCircle score={Math.round(stats?.riesgoPromedio ?? 61)} size="md" />
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Conclusión</p>
            <p className="text-xs text-slate-600 leading-relaxed">Se requiere atención inmediata en el sector de infraestructura. Se recomiendan auditorías cruzadas.</p>
          </div>
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <button
              onClick={handleDescargar}
              disabled={descargando}
              className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 text-white text-xs rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60"
            >
              {descargando ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              {descargando ? 'Descargando...' : 'Descargar Excel'}
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
