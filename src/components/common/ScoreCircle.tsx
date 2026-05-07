import { cn } from '@/utils/helpers'
import type { RiskLevel } from '@/types/shared.types'
import { getRiskFromScore } from '@/utils/helpers'

interface ScoreCircleProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  riskCategory?: RiskLevel
}

const strokeColors: Record<RiskLevel, string> = {
  'CRÍTICO': '#DC2626',
  'ALTO': '#EF4444',
  'MEDIO': '#F59E0B',
  'BAJO': '#10B981',
}

const textColors: Record<RiskLevel, string> = {
  'CRÍTICO': 'text-red-700',
  'ALTO': 'text-red-500',
  'MEDIO': 'text-orange-500',
  'BAJO': 'text-green-500',
}

const sizes = {
  sm: { container: 'w-16 h-16', text: 'text-base' },
  md: { container: 'w-24 h-24', text: 'text-2xl' },
  lg: { container: 'w-32 h-32', text: 'text-3xl' },
}

export function ScoreCircle({ score, size = 'md', showLabel = true, riskCategory }: ScoreCircleProps) {
  const category = riskCategory ?? getRiskFromScore(score)
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn('relative', sizes[size].container)}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} className="stroke-slate-200 fill-none" strokeWidth="8" />
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke={strokeColors[category]}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.7s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('font-bold', sizes[size].text)}>{score}</span>
          <span className="text-xs text-slate-400">/100</span>
        </div>
      </div>
      {showLabel && (
        <span className={cn('text-sm font-semibold', textColors[category])}>
          Riesgo {category}
        </span>
      )}
    </div>
  )
}
