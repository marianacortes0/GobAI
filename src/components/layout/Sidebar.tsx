import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Bot, Bell, BarChart3, Settings, Shield, Network, Info
} from 'lucide-react'
import { cn } from '@/utils/helpers'
import { useAlertaStats } from '@/hooks/useAlertas'
import { useDashboardStats } from '@/hooks/useDashboard'
import { formatNumber, formatDate } from '@/utils/formatters'

export function Sidebar() {
  const { data: alertaStats } = useAlertaStats()
  const { data: stats } = useDashboardStats()

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: 0 },
    { to: '/contratos', icon: FileText, label: 'Contratos', badge: 0 },
    { to: '/analisis/nuevo', icon: Bot, label: 'Análisis IA', badge: 0 },
    { to: '/alertas', icon: Bell, label: 'Alertas', badge: alertaStats?.pendientes ?? 0 },
    { to: '/mapa-relaciones', icon: Network, label: 'Mapa de relaciones', badge: 0 },
    { to: '/reportes', icon: BarChart3, label: 'Reportes', badge: 0 },
    { to: '/configuracion', icon: Settings, label: 'Configuración', badge: 0 },
  ]

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-slate-900 flex flex-col z-30">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-slate-700">
        <Shield className="w-7 h-7 text-blue-400" />
        <span className="text-white font-bold text-lg tracking-tight">GobIA Auditor</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="flex-1">{label}</span>
            {badge > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {badge > 99 ? '99+' : badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-3 border-t border-slate-700 space-y-1">
        <div className="flex items-center gap-1.5">
          <Info className="w-3 h-3 text-slate-500" />
          <p className="text-xs text-slate-400 font-medium">Sobre los datos</p>
        </div>
        <p className="text-xs text-slate-500 leading-snug">La información proviene de SECOP II y se actualiza diariamente.</p>
      </div>

      <div className="px-5 py-4 border-t border-slate-700">
        <p className="text-xs text-slate-500 font-medium">Todos los datos</p>
        <p className="text-xs text-slate-500">
          SECOP II · {stats ? `${formatNumber(stats.totalContratos)} contratos` : '—'}
        </p>
        {stats?.ultimaActualizacion && (
          <p className="text-xs text-slate-600 mt-1">Act. {formatDate(stats.ultimaActualizacion, "dd MMM yyyy")}</p>
        )}
      </div>
    </aside>
  )
}
