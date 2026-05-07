import { useState } from 'react'
import { BarChart3, Calendar, Download, Share2, Clock, FileText } from 'lucide-react'
import { KPICard } from '@/components/common/KPICard'
import { ScoreCircle } from '@/components/common/ScoreCircle'
import { DonutChart } from '@/components/charts/DonutChart'
import { HorizontalBarChart } from '@/components/charts/HorizontalBarChart'
import { LineChart } from '@/components/charts/LineChart'
import { RISK_COLORS, DEPARTAMENTOS } from '@/utils/constants'
import { formatDate } from '@/utils/formatters'

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
  historialExportacion: [
    { fecha: '2024-02-14', formato: 'PDF', usuario: 'Ana García' },
    { fecha: '2024-02-10', formato: 'XLSX', usuario: 'Carlos López' },
    { fecha: '2024-02-05', formato: 'PDF', usuario: 'Ana García' },
  ],
}

export function ReportesPage() {
  const [activeTab, setActiveTab] = useState<TabId>('resumen')
  const [tipo, setTipo] = useState('EJECUTIVO')
  const [periodo, setPeriodo] = useState('MES')
  const [departamento, setDepartamento] = useState('')
  const [formato, setFormato] = useState('PDF')
  const [selectedReporte] = useState(true)

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

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0 space-y-5">
        <h1 className="text-xl font-bold text-slate-800">Reportes</h1>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Tipo</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white outline-none focus:border-blue-400">
                {['EJECUTIVO', 'DETALLADO', 'ALERTAS', 'CONTRATACION', 'IA'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Período</label>
              <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white outline-none focus:border-blue-400">
                {['SEMANA', 'MES', 'TRIMESTRE', 'ANUAL'].map(p => <option key={p} value={p}>{p}</option>)}
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
              <select value={formato} onChange={(e) => setFormato(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white outline-none focus:border-blue-400">
                {['PDF', 'XLSX', 'CSV'].map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50">
              <Calendar className="w-4 h-4" /> Programar
            </button>
            <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">
              <BarChart3 className="w-4 h-4" /> Generar reporte
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
          <KPICard title="Reportes generados" value={128} icon={FileText} />
          <KPICard title="Programados" value={14} icon={Clock} iconBg="bg-orange-50" iconColor="text-orange-500" />
          <KPICard title="Descargas" value={356} icon={Download} iconBg="bg-green-50" iconColor="text-green-500" />
          <KPICard title="Riesgo promedio" value="61/100" icon={BarChart3} iconBg="bg-red-50" iconColor="text-red-500" valueColor="text-red-600" />
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
          {activeTab !== 'resumen' && (
            <div className="py-8 text-center text-slate-400 text-sm">
              Contenido de la pestaña {tabs.find(t => t.id === activeTab)?.label} disponible al generar un reporte.
            </div>
          )}
        </div>
      </div>

      {selectedReporte && (
        <aside className="w-72 shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 sticky top-6">
            <h3 className="text-sm font-semibold text-slate-700">Detalle del reporte</h3>
            <div className="space-y-1.5 text-xs text-slate-600">
              <p><strong>Tipo:</strong> {tipo}</p>
              <p><strong>Período:</strong> {periodo}</p>
              <p><strong>Formato:</strong> {formato}</p>
              <p><strong>Contratos:</strong> 248</p>
            </div>
            <ScoreCircle score={61} size="md" />
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Conclusión</p>
              <p className="text-xs text-slate-600 leading-relaxed">Se requiere atención inmediata en el sector de infraestructura. Se recomiendan auditorías cruzadas.</p>
            </div>
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 text-white text-xs rounded-lg font-medium hover:bg-blue-700">
                <Download className="w-3.5 h-3.5" /> Descargar
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-2 border border-slate-200 text-slate-600 text-xs rounded-lg font-medium hover:bg-slate-50">
                <Share2 className="w-3.5 h-3.5" /> Compartir
              </button>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Historial de exportación</p>
              <div className="space-y-1.5">
                {MOCK_REPORTE.historialExportacion.map((h, i) => (
                  <div key={i} className="flex items-center justify-between text-xs text-slate-500">
                    <span>{formatDate(h.fecha)} — {h.formato}</span>
                    <span className="text-slate-400">{h.usuario.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}
