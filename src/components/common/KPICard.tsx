import { TrendingUp, TrendingDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/helpers'

interface KPICardProps {
  title: string
  value: number | string
  subtitle?: string
  trend?: number
  trendLabel?: string
  icon?: LucideIcon
  iconBg?: string
  iconColor?: string
  valueColor?: string
}

export function KPICard({ title, value, subtitle, trend, trendLabel, icon: Icon, iconBg = 'bg-blue-50', iconColor = 'text-blue-500', valueColor }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{title}</p>
          <p className={cn('text-3xl font-bold text-slate-800', valueColor)}>
            {typeof value === 'number' ? value.toLocaleString('es-CO') : value}
          </p>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={cn('p-3 rounded-xl', iconBg)}>
            <Icon className={cn('w-6 h-6', iconColor)} />
          </div>
        )}
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1">
          {trend > 0 ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={cn('text-sm font-medium', trend > 0 ? 'text-green-600' : 'text-red-600')}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          {trendLabel && <span className="text-xs text-slate-400 ml-1">{trendLabel}</span>}
        </div>
      )}
    </div>
  )
}
