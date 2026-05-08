import { useState } from 'react'
import { Play, Download, ExternalLink, Loader2, Brain, AlertTriangle, Search, TrendingUp } from 'lucide-react'
import { KPICard } from '@/components/common/KPICard'
import { ScoreCircle } from '@/components/common/ScoreCircle'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { HorizontalBarChart } from '@/components/charts/HorizontalBarChart'
import { useEjecutarAnalisis } from '@/hooks/useAnalisis'
import type { Analisis } from '@/types/analisis.types'

const MOCK_ANALISIS: Analisis = {
  id: 'a1',
  contratoId: '1',
  idProceso: 'SN-2024-001234',
  entidad: 'Alcaldía de Bogotá',
  modelo: 'claude-sonnet-4-6',
  modoAnalisis: 'Completo',
  scoreTotal: 82,
  senalesCriticas: 4,
  hallazgosIA: 7,
  confianza: 91,
  riesgo: 'ALTO',
  resumenEjecutivo: 'El contrato SN-2024-001234 presenta múltiples señales de riesgo que requieren atención inmediata. Se identificaron patrones de restricción de competencia, precios superiores al mercado y ausencia de estudios previos completos. La combinación de estos factores eleva el score de riesgo a 82/100, clasificando el contrato como ALTO riesgo de irregularidad.',
  factoresPonderados: [
    { nombre: 'Anomalías textuales', peso: 30, valor: 85, color: '#EF4444' },
    { nombre: 'Concentración proveedor', peso: 25, valor: 72, color: '#F97316' },
    { nombre: 'Urgencias injustificadas', peso: 20, valor: 45, color: '#FBBF24' },
    { nombre: 'Fraccionamiento', peso: 15, valor: 90, color: '#EF4444' },
    { nombre: 'Historial proveedor', peso: 10, valor: 60, color: '#F59E0B' },
  ],
  trazabilidad: [
    { numero: 1, titulo: 'Ingesta de datos', descripcion: 'Carga de documentos del proceso SECOP II', estado: 'COMPLETADO' },
    { numero: 2, titulo: 'Análisis semántico', descripcion: 'Procesamiento NLP de textos contractuales', estado: 'COMPLETADO' },
    { numero: 3, titulo: 'Evaluación de riesgo', descripcion: 'Aplicación del motor de reglas ponderadas', estado: 'COMPLETADO' },
    { numero: 4, titulo: 'Generación de informe', descripcion: 'Síntesis de hallazgos y recomendaciones', estado: 'COMPLETADO' },
  ],
  hallazgos: [
    { id: 'h1', titulo: 'Restricción de competencia', descripcion: 'Los requisitos habilitantes excluyen artificialmente a potenciales proponentes.', severidad: 'ALTA', tipo: 'Normativo' },
    { id: 'h2', titulo: 'Precio base elevado', descripcion: 'El valor base supera en un 35% el promedio del mercado para contratos similares.', severidad: 'ALTA', tipo: 'Financiero' },
    { id: 'h3', titulo: 'Ausencia de estudios previos', descripcion: 'No se encontraron estudios de mercado completos en los documentos del proceso.', severidad: 'MEDIA', tipo: 'Documental' },
    { id: 'h4', titulo: 'Plazo de ejecución inusual', descripcion: 'El plazo de 18 meses es significativamente menor al estándar para este tipo de obra.', severidad: 'BAJA', tipo: 'Operativo' },
  ],
  evidencias: [
    { campo: 'Pliego de condiciones', texto: '"Solo podrán participar empresas con más de 15 años de experiencia específica..."', relevancia: 'ALTA' },
    { campo: 'Estudio de mercado', texto: '"El precio unitario del m² de vía en Bogotá oscila entre $450,000 y $620,000..."', relevancia: 'ALTA' },
  ],
  recomendaciones: [
    'Revisar y ajustar los requisitos habilitantes para ampliar la competencia.',
    'Realizar nuevo estudio de mercado con al menos 3 fuentes independientes.',
    'Solicitar justificación técnica del precio base al área responsable.',
    'Verificar el cumplimiento del principio de planeación en el proceso.',
  ],
  fechaAnalisis: '2024-02-15T10:30:00Z',
  entradasAnalizadas: ['Descripción del objeto', 'Justificación', 'Pliego de condiciones', 'Estudio de mercado', 'Adendas'],
}

type TabId = 'resumen' | 'hallazgos' | 'evidencia' | 'recomendaciones'

export function AnalisisIAPage() {
  const [contratoId, setContratoId] = useState('SN-2024-001234')
  const [modelo, setModelo] = useState('claude-sonnet-4-6')
  const [modo, setModo] = useState('Completo')
  const [analisis, setAnalisis] = useState<Analisis | null>(MOCK_ANALISIS)
  const [activeTab, setActiveTab] = useState<TabId>('resumen')
  const { mutate: ejecutar, isPending } = useEjecutarAnalisis()

  function handleEjecutar() {
    ejecutar({ contratoId, modelo, modo }, {
      onSuccess: (data) => setAnalisis(data),
      onError: () => setAnalisis(MOCK_ANALISIS),
    })
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: 'resumen', label: 'Resumen' },
    { id: 'hallazgos', label: 'Hallazgos' },
    { id: 'evidencia', label: 'Evidencia textual' },
    { id: 'recomendaciones', label: 'Recomendaciones' },
  ]

  const severityColor: Record<string, string> = { ALTA: 'border-l-red-500', MEDIA: 'border-l-orange-400', BAJA: 'border-l-yellow-400' }

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Análisis IA</h1>
          <p className="text-sm text-slate-500 mt-0.5">Examina hallazgos, evidencia textual y explicabilidad generada por IA sobre procesos contractuales</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-48">
              <label className="block text-xs font-medium text-slate-500 mb-1">Contrato / ID Proceso</label>
              <input value={contratoId} onChange={(e) => setContratoId(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-400" placeholder="SN-2024-001234" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Modelo IA</label>
              <select value={modelo} onChange={(e) => setModelo(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white outline-none focus:border-blue-400">
                <option value="claude-sonnet-4-6">Claude Sonnet 4.6</option>
                <option value="claude-opus-4-7">Claude Opus 4.7</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Modo análisis</label>
              <select value={modo} onChange={(e) => setModo(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white outline-none focus:border-blue-400">
                <option>Completo</option>
                <option>Rápido</option>
                <option>Focalizado</option>
              </select>
            </div>
            <button onClick={handleEjecutar} disabled={isPending || !contratoId} className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition-colors">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {isPending ? 'Analizando...' : 'Ejecutar análisis'}
            </button>
          </div>
          {analisis && (
            <div className="mt-3 flex flex-wrap gap-2">
              <p className="text-xs text-slate-500 font-medium mr-1">Entradas analizadas:</p>
              {analisis.entradasAnalizadas.map((e, i) => (
                <span key={i} className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100">{e}</span>
              ))}
            </div>
          )}
        </div>

        {isPending && <LoadingSpinner />}

        {analisis && !isPending && (
          <>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              <KPICard title="Score total" value={analisis.scoreTotal} icon={TrendingUp} iconBg="bg-red-50" iconColor="text-red-500" valueColor="text-red-600" />
              <KPICard title="Señales críticas" value={analisis.senalesCriticas} icon={AlertTriangle} iconBg="bg-orange-50" iconColor="text-orange-500" />
              <KPICard title="Hallazgos IA" value={analisis.hallazgosIA} icon={Search} iconBg="bg-blue-50" iconColor="text-blue-500" />
              <KPICard title="Confianza" value={`${analisis.confianza}%`} icon={Brain} iconBg="bg-green-50" iconColor="text-green-500" />
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

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              {activeTab === 'resumen' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Resumen ejecutivo</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{analisis.resumenEjecutivo}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Factores ponderados</h3>
                    <HorizontalBarChart
                      data={analisis.factoresPonderados.map(f => ({ label: `${f.nombre} (${f.peso}%)`, value: f.valor, max: 100, color: f.color }))}
                      showPercent
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Trazabilidad del análisis</h3>
                    <ol className="space-y-2">
                      {analisis.trazabilidad.map(paso => (
                        <li key={paso.numero} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center shrink-0 mt-0.5">{paso.numero}</div>
                          <div>
                            <p className="text-sm font-medium text-slate-700">{paso.titulo}</p>
                            <p className="text-xs text-slate-500">{paso.descripcion}</p>
                          </div>
                          <span className="ml-auto text-xs text-green-600 font-medium">{paso.estado}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
              {activeTab === 'hallazgos' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Hallazgos principales</h3>
                  {analisis.hallazgos.map(h => (
                    <div key={h.id} className={`p-4 border-l-4 rounded-r-lg bg-slate-50 ${severityColor[h.severidad] ?? 'border-l-slate-300'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-slate-700">{h.titulo}</p>
                        <span className="text-xs px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-500">{h.tipo}</span>
                      </div>
                      <p className="text-xs text-slate-600">{h.descripcion}</p>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'evidencia' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Evidencia textual destacada</h3>
                  {analisis.evidencias.map((e, i) => (
                    <div key={i} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs font-semibold text-yellow-800 mb-1.5">Campo: {e.campo}</p>
                      <blockquote className="text-sm text-slate-700 italic border-l-2 border-yellow-400 pl-3">{e.texto}</blockquote>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'recomendaciones' && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Recomendaciones</h3>
                  <ol className="space-y-2">
                    {analisis.recomendaciones.map((r, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                        <span className="font-bold text-blue-600 shrink-0">{i + 1}.</span> {r}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {analisis && (
        <aside className="w-72 shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 sticky top-6">
            <h3 className="text-sm font-semibold text-slate-700">Resultado del análisis</h3>
            <ScoreCircle score={analisis.scoreTotal} riskCategory={analisis.riesgo} size="lg" />
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1.5">Señales detectadas</p>
              <div className="space-y-1">
                {analisis.hallazgos.slice(0, 3).map(h => (
                  <div key={h.id} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    {h.titulo}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Explicación IA</p>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">{analisis.resumenEjecutivo}</p>
            </div>
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <a
                href="https://community.secop.gov.co/STS/Users/Login/Index?SkinName=CCE&currentLanguage=es-CO&Page=login&Country=CO"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 text-white text-xs rounded-lg font-medium hover:bg-blue-700"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Ver proceso en SECOP
              </a>
              <button className="w-full flex items-center justify-center gap-2 py-2 border border-slate-200 text-slate-600 text-xs rounded-lg font-medium hover:bg-slate-50">
                <Download className="w-3.5 h-3.5" /> Descargar informe
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}
