import { cn } from '@/utils/helpers'
import { RISK_BG_CLASSES } from '@/utils/constants'
import type { RiskLevel } from '@/types/shared.types'

interface RiskBadgeProps {
  level: RiskLevel
  size?: 'sm' | 'md'
}

export function RiskBadge({ level, size = 'md' }: RiskBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center font-semibold rounded-full border',
      RISK_BG_CLASSES[level],
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
    )}>
      {level}
    </span>
  )
}
