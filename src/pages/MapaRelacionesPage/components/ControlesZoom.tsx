import { Maximize2, Minus, Plus } from 'lucide-react'
import type { Core } from 'cytoscape'
import type { ReactNode } from 'react'

interface Props {
  cy: Core | null
}

export function ControlesZoom({ cy }: Props) {
  const zoomIn = () => cy?.zoom({ level: cy.zoom() * 1.2, renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } })
  const zoomOut = () => cy?.zoom({ level: cy.zoom() / 1.2, renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } })
  const fit = () => cy?.fit(undefined, 60)

  return (
    <div className="absolute right-4 top-4 z-20 flex flex-col overflow-hidden rounded-lg border border-slate-700 bg-slate-900/85 backdrop-blur">
      <Btn onClick={zoomIn} label="Acercar" disabled={!cy}>
        <Plus className="w-4 h-4" />
      </Btn>
      <div className="h-px bg-slate-700" />
      <Btn onClick={zoomOut} label="Alejar" disabled={!cy}>
        <Minus className="w-4 h-4" />
      </Btn>
      <div className="h-px bg-slate-700" />
      <Btn onClick={fit} label="Encajar" disabled={!cy}>
        <Maximize2 className="w-4 h-4" />
      </Btn>
    </div>
  )
}

function Btn({
  children,
  onClick,
  label,
  disabled,
}: {
  children: ReactNode
  onClick: () => void
  label: string
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
      className="flex w-9 h-9 items-center justify-center text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:opacity-40"
    >
      {children}
    </button>
  )
}
