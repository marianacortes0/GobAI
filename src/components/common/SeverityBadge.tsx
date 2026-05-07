import { cn } from '@/utils/helpers'
import { SEVERITY_BG_CLASSES } from '@/utils/constants'
import type { Severity } from '@/types/shared.types'

interface SeverityBadgeProps {
  level: Severity
  size?: 'sm' | 'md'
}

export function SeverityBadge({ level, size = 'md' }: SeverityBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center font-semibold rounded-full border',
      SEVERITY_BG_CLASSES[level],
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
    )}>
      {level}
    </span>
  )
}
