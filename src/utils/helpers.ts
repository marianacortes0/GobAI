import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'
import type { RiskLevel } from '@/types/shared.types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRiskFromScore(score: number): RiskLevel {
  if (score >= 85) return 'CRÍTICO'
  if (score >= 70) return 'ALTO'
  if (score >= 40) return 'MEDIO'
  return 'BAJO'
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()
}
