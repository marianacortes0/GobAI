import { useState } from 'react'
import { Play, Download, ExternalLink, Loader2, AlertTriangle, Search, TrendingUp } from 'lucide-react'
import { KPICard } from '@/components/common/KPICard'
import { ScoreCircle } from '@/components/common/ScoreCircle'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { HorizontalBarChart } from '@/components/charts/HorizontalBarChart'
import { useContrato } from '@/hooks/useContratos'
import { useToast } from '@/hooks/useToast'
import { formatCurrency } from '@/utils/formatters'

type TabId = 'resumen' | 'hallazgos' | 'detalles' | 'recomendaciones'

export function AnalisisIAPage() {
  const [contratoId, setContratoId] = useState('')
  const [searchId, setSearchId] = useState('')
  const [modelo, setModelo] = useState('claude-3-5-sonnet-latest')
  const [modo, setModo] = useState('Completo')
  const [activeTab, setActiveTab] = useState<TabId>('resumen')
  
  const { data: contrato, isLoading, isError } = useContrato(searchId)
  const toast = useToast()

  function handleEjecutar() {
    if (contratoId.trim()) {
      setSearchId(contratoId.trim())
    } else {
      toast.error('Ingresa un ID de contrato válido')
    }
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: 'resumen', label: 'Resumen' },
    { id: 'hallazgos', label: 'Hallazgos' },
    { id: 'detalles', label: 'Detalles del Proceso' },
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
              <input
                value={contratoId}
                onChange={(e) => setContratoId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEjecutar()}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-400"
                placeholder="CO1.REQ.10194417_10476"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Modelo IA</label>
              <select value={modelo} onChange={(e) => setModelo(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white outline-none focus:border-blue-400">
                <option value="claude-3-5-sonnet-latest">Claude Sonnet 3.5</option>
                <option value="claude-3-opus-latest">Claude Opus 3</option>
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
            <button
              onClick={handleEjecutar}
              disabled={isLoading || !contratoId.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition-colors h-[38px]"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {isLoading ? 'Analizando...' : 'Ejecutar análisis'}
            </button>
          </div>
        </div>

        {isLoading && <LoadingSpinner className="!py-0" />}

        {!contrato && !isLoading && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <EmptyState
              title="Aún no has ejecutado un análisis"
              description="Ingresa un ID de contrato o proceso (formato CO1.REQ.XXXXXXXX_XXXXX) y pulsa 'Ejecutar análisis'."
            />
          </div>
        )}

        {contrato && !isLoading && (
          <>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              <KPICard title="Score total" value={contrato.scoreRiesgo} icon={TrendingUp} iconBg="bg-red-50" iconColor="text-red-500" valueColor="text-red-600" />
              <KPICard title="Señales críticas" value={contrato.senalesDetectadas.length} icon={AlertTriangle} iconBg="bg-orange-50" iconColor="text-orange-500" />
              <KPICard title="Valor base" value={formatCurrency(contrato.valorBase)} icon={Search} iconBg="bg-blue-50" iconColor="text-blue-500" />
              <KPICard title="Estado" value={contrato.estado} icon={TrendingUp} iconBg="bg-green-50" iconColor="text-green-500" />
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

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 min-h-[300px]">
              {activeTab === 'resumen' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Resumen ejecutivo</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {contrato.evaluacion?.resumen || contrato.descripcionTecnica || 'No hay un resumen narrativo disponible para este contrato en este momento.'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Distribución de Riesgo</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Entidad Contratante</p>
                        <p className="text-sm font-bold text-slate-800">{contrato.entidad}</p>
                        <p className="text-xs text-slate-500">NIT: {contrato.nit}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Modalidad</p>
                        <p className="text-sm font-bold text-slate-800">{contrato.modalidad}</p>
                        <p className="text-xs text-slate-500">Fecha: {contrato.fechaPublicacion}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'hallazgos' && (
                contrato.senalesDetectadas.length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Banderas Rojas Detectadas</h3>
                    {contrato.senalesDetectadas.map((s, i) => (
                      <div key={i} className={`p-4 border-l-4 rounded-r-lg bg-red-50 border-l-red-500`}>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-slate-700">{s}</p>
                          <span className="text-xs px-2 py-0.5 bg-white border border-red-200 rounded text-red-500">CRÍTICO</span>
                        </div>
                        <p className="text-xs text-slate-600">Se detectó una posible irregularidad o patrón de riesgo en este factor contractual.</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState title="Sin hallazgos" description="El motor de riesgo no detectó banderas activas para este contrato." />
                )
              )}
              {activeTab === 'detalles' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Detalles Técnicos</h3>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                      <div><span className="text-slate-500">ID del Proceso:</span> <span className="font-medium text-slate-700">{contrato.idProceso}</span></div>
                      <div><span className="text-slate-500">Estado:</span> <span className="font-medium text-slate-700">{contrato.estado}</span></div>
                      <div><span className="text-slate-500">Fecha Pub:</span> <span className="font-medium text-slate-700">{contrato.fechaPublicacion}</span></div>
                      <div><span className="text-slate-500">Valor Base:</span> <span className="font-medium text-slate-700">{formatCurrency(contrato.valorBase)}</span></div>
                    </div>
                    <div className="pt-3 border-t border-slate-200">
                      <span className="text-slate-500 text-sm block mb-1">Objeto del Contrato:</span>
                      <p className="text-sm text-slate-700">{contrato.objeto}</p>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'recomendaciones' && (
                (contrato.evaluacion?.recomendaciones?.length ?? 0) > 0 ? (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Recomendaciones de Auditoría</h3>
                    <ol className="space-y-2">
                      {contrato.evaluacion!.recomendaciones.map((r, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                          <span className="font-bold text-blue-600 shrink-0">{i + 1}.</span> {r}
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : (
                  <EmptyState
                    title="Procedimiento Estándar"
                    description={contrato.scoreRiesgo > 60 ? "Se recomienda una revisión exhaustiva de los pliegos de condiciones y el cronograma." : "Se recomienda monitoreo preventivo durante la ejecución del contrato."}
                  />
                )
              )}
            </div>
          </>
        )}
      </div>

      {contrato && (
        <aside className="w-72 shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 sticky top-6">
            <h3 className="text-sm font-semibold text-slate-700">Resultado del análisis</h3>
            <ScoreCircle score={contrato.scoreRiesgo} riskCategory={contrato.riesgo} size="lg" />
            
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Análisis de Riesgo</p>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                El proceso presenta un nivel de riesgo {contrato.riesgo} basado en {contrato.senalesDetectadas.length} señales detectadas.
              </p>
            </div>
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <a
                href={`https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeGuid=${contrato.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 text-white text-xs rounded-lg font-medium hover:bg-blue-700"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Ver proceso en SECOP
              </a>
              <button
                onClick={() => window.print()}
                className="w-full flex items-center justify-center gap-2 py-2 border border-slate-200 text-slate-600 text-xs rounded-lg font-medium hover:bg-slate-50"
              >
                <Download className="w-3.5 h-3.5" /> Descargar informe
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}
