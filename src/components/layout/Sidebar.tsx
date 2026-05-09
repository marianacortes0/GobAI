import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Bot, Bell, BarChart3, Settings, Shield, Network
} from 'lucide-react'
import { cn } from '@/utils/helpers'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: 0 },
  { to: '/contratos', icon: FileText, label: 'Contratos', badge: 0 },
  { to: '/analisis/nuevo', icon: Bot, label: 'Análisis IA', badge: 0 },
  { to: '/alertas', icon: Bell, label: 'Alertas', badge: 4 },
  { to: '/mapa-relaciones', icon: Network, label: 'Mapa de relaciones', badge: 0 },
  { to: '/reportes', icon: BarChart3, label: 'Reportes', badge: 0 },
  { to: '/configuracion', icon: Settings, label: 'Configuración', badge: 0 },
]

export function Sidebar() {
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
                {badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-slate-700">
        <p className="text-xs text-slate-500 font-medium">Todos los datos</p>
        <p className="text-xs text-slate-500">SECOP II · 99,353 contratos</p>
        <p className="text-xs text-slate-600 mt-1">Act. 07 May 2026</p>
      </div>
    </aside>
  )
}
