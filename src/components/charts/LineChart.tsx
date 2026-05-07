import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface LineChartProps {
  data: Array<Record<string, unknown>>
  xKey: string
  yKey: string
  color?: string
  label?: string
}

export function LineChart({ data, xKey, yKey, color = '#3B82F6', label }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <ReLineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
        <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#94A3B8' }} />
        <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
          labelStyle={{ color: '#0F172A', fontWeight: 600 }}
        />
        <Line type="monotone" dataKey={yKey} stroke={color} strokeWidth={2} dot={{ r: 3, fill: color }} name={label ?? yKey} />
      </ReLineChart>
    </ResponsiveContainer>
  )
}
