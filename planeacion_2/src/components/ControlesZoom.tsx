import { Maximize2, Minus, Plus } from 'lucide-react';
import type { Core } from 'cytoscape';

interface Props {
  cy: Core | null;
}

export default function ControlesZoom({ cy }: Props) {
  const zoomIn = () => cy?.zoom({ level: cy.zoom() * 1.2, renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } });
  const zoomOut = () => cy?.zoom({ level: cy.zoom() / 1.2, renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } });
  const fit = () => cy?.fit(undefined, 60);

  const Btn = ({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label: string }) => (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-9 w-9 items-center justify-center text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:opacity-40"
      disabled={!cy}
    >
      {children}
    </button>
  );

  return (
    <div className="absolute right-4 top-4 z-20 flex flex-col overflow-hidden rounded-lg border border-slate-700 bg-slate-900/85 backdrop-blur">
      <Btn onClick={zoomIn} label="Acercar">
        <Plus className="h-4 w-4" />
      </Btn>
      <div className="h-px bg-slate-700" />
      <Btn onClick={zoomOut} label="Alejar">
        <Minus className="h-4 w-4" />
      </Btn>
      <div className="h-px bg-slate-700" />
      <Btn onClick={fit} label="Encajar">
        <Maximize2 className="h-4 w-4" />
      </Btn>
    </div>
  );
}
