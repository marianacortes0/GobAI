import { useState, useEffect } from 'react'
import { Download, ExternalLink, Brain, AlertTriangle, Search, TrendingUp, Info, Eye, FileText, CheckCircle2 } from 'lucide-react'
import { KPICard } from '@/components/common/KPICard'
import { ScoreCircle } from '@/components/common/ScoreCircle'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { useContrato } from '@/hooks/useContratos'
import { useToast } from '@/hooks/useToast'
import { formatCurrency } from '@/utils/formatters'

type TabId = 'resumen' | 'hallazgos' | 'detalles'

export function AnalisisIAPage() {
  const [contratoId, setContratoId] = useState('')
  const [searchId, setSearchId] = useState('')
  const { data: contrato, isLoading, isError } = useContrato(searchId)
  const [activeTab, setActiveTab] = useState<TabId>('resumen')
  const toast = useToast()

  useEffect(() => {
    if (isError && searchId) {
      toast.error('Contrato no encontrado o error en el servidor')
    }
  }, [isError, searchId, toast])

  function handleAnalizar() {
    if (contratoId.trim()) {
      setSearchId(contratoId.trim())
    }
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: 'resumen', label: 'Resumen de Riesgo' },
    { id: 'hallazgos', label: 'Señales Detectadas' },
    { id: 'detalles', label: 'Información del Proceso' },
  ]

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Análisis Técnico de Riesgo</h1>
          <p className="text-sm text-slate-500 mt-0.5">Reporte detallado de auditoría generado por el motor de riesgo del Dashboard</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 mb-1">ID del Contrato / Proceso</label>
              <div className="relative">
                <input
                  value={contratoId}
                  onChange={(e) => setContratoId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalizar()}
                  className="w-full pl-3 pr-10 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-400"
                  placeholder="Ej: CO1.REQ.10194417_10476"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
              </div>
            </div>
            <button
              onClick={handleAnalizar}
              disabled={isLoading || !contratoId.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition-colors h-[38px]"
            >
              {isLoading ? <LoadingSpinner size="sm" color="white" /> : <Eye className="w-4 h-4" />}
              {isLoading ? 'Consultando...' : 'Analizar'}
            </button>
          </div>
        </div>

        {isLoading && <LoadingSpinner />}

        {!contrato && !isLoading && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <EmptyState
              title="Consulta un proceso contractual"
              description="Ingresa el ID (formato SECOP II) para extraer el perfil de riesgo, banderas críticas y evaluación técnica."
            />
          </div>
        )}

        {contrato && !isLoading && (
          <>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              <KPICard title="Score de Riesgo" value={contrato.scoreRiesgo} icon={TrendingUp} iconBg="bg-red-50" iconColor="text-red-500" valueColor="text-red-600" />
              <KPICard title="Señales Detectadas" value={contrato.senalesDetectadas.length} icon={AlertTriangle} iconBg="bg-orange-50" iconColor="text-orange-500" />
              <KPICard title="Estado Proceso" value={contrato.estado} icon={CheckCircle2} iconBg="bg-green-50" iconColor="text-green-500" />
              <KPICard title="Valor Base" value={formatCurrency(contrato.valorBase)} icon={FileText} iconBg="bg-blue-50" iconColor="text-blue-500" />
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
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Evaluación del Motor de Riesgo</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {contrato.evaluacion?.resumen || contrato.descripcionTecnica || 'No hay un resumen narrativo disponible para este contrato en este momento.'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Entidad Contratante</p>
                      <p className="text-sm font-bold text-slate-800">{contrato.entidad}</p>
                      <p className="text-xs text-slate-500">NIT: {contrato.nit || 'No disponible'}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Modalidad</p>
                      <p className="text-sm font-bold text-slate-800">{contrato.modalidad}</p>
                      <p className="text-xs text-slate-500">Fecha: {contrato.fechaPublicacion}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'hallazgos' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Banderas Rojas y Señales Críticas</h3>
                  {contrato.senalesDetectadas.length > 0 ? (
                    <div className="grid gap-3">
                      {contrato.senalesDetectadas.map((s, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-red-800">{s}</p>
                            <p className="text-xs text-red-600">Esta señal indica una posible desviación en el proceso competitivo o financiero.</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState title="Sin señales críticas" description="El motor heurístico no encontró desviaciones significativas en este proceso." />
                  )}
                </div>
              )}

              {activeTab === 'detalles' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Detalles Técnicos del Proceso</h3>
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
            </div>
          </>
        )}
      </div>

      {contrato && (
        <aside className="w-72 shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 sticky top-6">
            <h3 className="text-sm font-semibold text-slate-700">Resultado del Perfilado</h3>
            <ScoreCircle score={contrato.scoreRiesgo} riskCategory={contrato.riesgo} size="lg" />
            <div className="space-y-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Categoría</p>
                <p className={`text-sm font-bold ${contrato.riesgo === 'CRÍTICO' || contrato.riesgo === 'ALTO' ? 'text-red-600' : 'text-green-600'}`}>
                  RIESGO {contrato.riesgo}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Recomendación</p>
                <p className="text-xs text-slate-600">
                  {contrato.scoreRiesgo >= 60 
                    ? 'Requiere auditoría exhaustiva de los pliegos y cronograma.' 
                    : 'Monitoreo preventivo estándar durante la ejecución.'}
                </p>
              </div>
              <div className="space-y-2 pt-2">
                <a
                  href={`https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeGuid=${contrato.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 text-white text-xs rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Ver en SECOP II
                </a>
                <button
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center gap-2 py-2 border border-slate-200 text-slate-600 text-xs rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Imprimir Reporte
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}
