import { useState } from 'react'
import { Save, Download, History, X, Wifi, Brain, Shield, Bell, Loader2 } from 'lucide-react'
import { ScoreCircle } from '@/components/common/ScoreCircle'
import type { SystemStatus, CambioReciente } from '@/types/configuracion.types'
import { useToast } from '@/hooks/useToast'

interface Props {
  status: SystemStatus
  cambiosRecientes: CambioReciente[]
  onGuardar: () => void
  guardando: boolean
  onExportar: () => void
  exportando: boolean
}

export function ResumenSidebar({ status, cambiosRecientes, onGuardar, guardando, onExportar, exportando }: Props) {
  const toast = useToast()
  const [open, setOpen] = useState(true)

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="shrink-0 self-start px-3 py-2 text-xs text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50">
        Mostrar resumen
      </button>
    )
  }

  const captionPrincipal = status.scoreGeneral >= 90 ? 'Configuración óptima' : status.scoreGeneral >= 70 ? 'Configuración aceptable' : 'Revisar configuración'

  const filas = [
    { icon: Wifi, label: 'Integración SECOP II', val: status.secopConectado ? 'Conectada' : 'Desconectada', color: status.secopConectado ? 'text-green-600' : 'text-red-600' },
    { icon: Brain, label: 'Modelo IA', val: status.modeloIAActivo ? 'Activo' : 'Inactivo', color: status.modeloIAActivo ? 'text-blue-600' : 'text-slate-400' },
    { icon: Shield, label: 'Reglas de riesgo', val: `${status.reglasActivas} configuradas`, color: 'text-orange-600' },
    { icon: Bell, label: 'Alertas', val: `${status.alertasActivas} activas`, color: 'text-red-600' },
  ]

  return (
    <aside className="w-72 shrink-0">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 sticky top-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">Resumen de configuración</h3>
          <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
        <ScoreCircle score={status.scoreGeneral} size="md" showLabel={false} />
        <div className="text-center">
          <p className="text-xs font-semibold text-slate-600">{captionPrincipal}</p>
          <p className="text-xs text-slate-400">Parámetros validados</p>
        </div>
        <div className="space-y-2">
          {filas.map(({ icon: Icon, label, val, color }) => (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Icon className={`w-3.5 h-3.5 ${color}`} />
                {label}
              </div>
              <span className={`text-xs font-semibold ${color}`}>{val}</span>
            </div>
          ))}
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Cambios recientes</p>
          <div className="space-y-1.5">
            {cambiosRecientes.map((c, i) => (
              <div key={i} className="text-xs text-slate-500">
                <p className="font-medium text-slate-600">{c.campo}</p>
                <p>{c.valor} — {c.fecha}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <button onClick={onGuardar} disabled={guardando} className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 text-white text-xs rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60">
            {guardando ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Guardar configuración
          </button>
          <button onClick={onExportar} disabled={exportando} className="w-full flex items-center justify-center gap-2 py-2 border border-slate-200 text-slate-600 text-xs rounded-lg font-medium hover:bg-slate-50 disabled:opacity-60">
            {exportando ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} Exportar parámetros
          </button>
          <button onClick={() => toast.info('El historial completo estará disponible próximamente')} className="w-full flex items-center justify-center gap-2 py-2 border border-slate-200 text-slate-600 text-xs rounded-lg font-medium hover:bg-slate-50">
            <History className="w-3.5 h-3.5" /> Ver historial
          </button>
        </div>
      </div>
    </aside>
  )
}
