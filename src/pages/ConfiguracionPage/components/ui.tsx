import { useState } from 'react'
import { Info } from 'lucide-react'
import { cn } from '@/utils/helpers'

export function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div id={id} className="border border-slate-200 rounded-xl overflow-hidden scroll-mt-24">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left">
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        <span className="text-slate-400 text-lg">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="p-5 bg-white space-y-4">{children}</div>}
    </div>
  )
}

export function Toggle({ label, info, checked, onChange }: { label: string; info?: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-1.5 text-sm text-slate-700">
        {label}
        {info && (
          <span title={info}>
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </span>
        )}
      </span>
      <button onClick={() => onChange(!checked)} className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-slate-300'}`}>
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  )
}

export function Slider({ label, min = 0, max = 100, value, onChange, unit = '%' }: { label: string; min?: number; max?: number; value: number; onChange: (value: number) => void; unit?: '%' | 'pts' }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm text-slate-700">{label}</label>
        <span className="text-sm font-semibold text-blue-600">{value}{unit === 'pts' ? ' pts' : '%'}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-600" />
    </div>
  )
}

const pillColors = {
  green: 'bg-green-50 text-green-700 border-green-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  slate: 'bg-slate-100 text-slate-600 border-slate-200',
}

export function Pill({ children, color = 'slate' }: { children: React.ReactNode; color?: keyof typeof pillColors }) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border', pillColors[color])}>
      {children}
    </span>
  )
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-medium text-slate-500 mb-1">{children}</label>
}

export const inputClass = 'w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-400'
export const selectClass = 'w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white outline-none focus:border-blue-400'
