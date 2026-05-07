import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

interface DonutChartProps {
  data: Array<{ name: string; value: number; color: string }>
  total?: number
  centerLabel?: string
}

export function DonutChart({ data, total, centerLabel }: DonutChartProps) {
  return (
    <div>
      <div className="relative">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {total !== undefined && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-slate-800">{total}</span>
            {centerLabel && <span className="text-xs text-slate-400">{centerLabel}</span>}
          </div>
        )}
      </div>
      <div className="mt-3 space-y-1.5">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-600">{item.name}</span>
            </div>
            <span className="font-semibold text-slate-700">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
