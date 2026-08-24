import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`
  }
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value)
}

export function formatDate(dateStr: string, fmt = 'dd/MM/yyyy'): string {
  try {
    return format(parseISO(dateStr), fmt, { locale: es })
  } catch {
    return dateStr
  }
}

export function formatDateLong(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "d 'de' MMMM 'de' yyyy", { locale: es })
  } catch {
    return dateStr
  }
}

export function formatTimestamp(value?: string): string {
  if (!value) return '—'
  return formatDate(value, 'dd/MM/yyyy, HH:mm')
}

export function formatRelativeTime(value?: string | null): string {
  if (!value) return '—'
  try {
    return formatDistanceToNow(parseISO(value), { locale: es, addSuffix: true })
  } catch {
    return '—'
  }
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-CO').format(value)
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function truncateText(text: string, maxLength = 80): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}
