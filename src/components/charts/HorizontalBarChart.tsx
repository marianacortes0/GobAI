interface BarItem {
  label: string
  value: number
  max?: number
  color?: string
}

interface HorizontalBarChartProps {
  data: BarItem[]
  showPercent?: boolean
}

export function HorizontalBarChart({ data, showPercent = false }: HorizontalBarChartProps) {
  return (
    <div className="space-y-3">
      {data.map((item, idx) => {
        const max = item.max ?? 100
        const percent = Math.min((item.value / max) * 100, 100)
        return (
          <div key={idx}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-600 truncate max-w-[60%]">{item.label}</span>
              <span className="text-xs font-semibold text-slate-700">
                {showPercent ? `${item.value}%` : item.value}
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${percent}%`, backgroundColor: item.color ?? '#3B82F6' }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
