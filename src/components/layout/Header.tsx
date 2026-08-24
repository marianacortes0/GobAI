import { Bell, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDashboardStats } from '@/hooks/useDashboard'
import { useAlertaStats } from '@/hooks/useAlertas'
import { formatRelativeTime } from '@/utils/formatters'

export function Header() {
  const navigate = useNavigate()
  const { data: stats } = useDashboardStats()
  const { data: alertaStats } = useAlertaStats()
  const tieneAlertasPendientes = (alertaStats?.pendientes ?? 0) > 0

  return (
    <header className="fixed top-0 left-60 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-20">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs font-semibold text-green-700">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Datos públicos SECOP II
          <TrendingUp className="w-3 h-3" />
        </span>
        {stats?.ultimaActualizacion && (
          <span className="text-xs text-slate-400 hidden md:inline">· Act. {formatRelativeTime(stats.ultimaActualizacion)}</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/alertas')}
          className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Bell className="w-5 h-5 text-slate-500" />
          {tieneAlertasPendientes && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
            AG
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-700">Ana García</p>
            <p className="text-xs text-slate-400">Auditor</p>
          </div>
        </div>
      </div>
    </header>
  )
}
