import { Search, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/utils/helpers'

interface SearchBoxProps {
  placeholder?: string
  value?: string
  onChange: (value: string) => void
  className?: string
}

export function SearchBox({ placeholder = 'Buscar...', value = '', onChange, className }: SearchBoxProps) {
  const [focused, setFocused] = useState(false)

  return (
    <div className={cn('relative flex items-center', className)}>
      <Search className={cn('absolute left-3 w-4 h-4 transition-colors', focused ? 'text-blue-500' : 'text-slate-400')} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          'w-full pl-10 pr-8 py-2.5 rounded-lg border text-sm bg-white transition-colors outline-none',
          focused ? 'border-blue-400 ring-2 ring-blue-50' : 'border-slate-200 hover:border-slate-300'
        )}
      />
      {value && (
        <button onClick={() => onChange('')} className="absolute right-3 text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
