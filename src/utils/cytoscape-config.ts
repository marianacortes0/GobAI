import type { Stylesheet } from 'cytoscape'

export const stylesheet: Stylesheet[] = [
  {
    selector: 'node',
    style: {
      label: 'data(label)',
      color: '#F8FAFC',
      'font-size': '13px',
      'font-weight': 600,
      'text-valign': 'bottom',
      'text-halign': 'center',
      'text-margin-y': 10,
      'text-outline-color': '#0B1220',
      'text-outline-width': 3,
      'text-background-color': '#0B1220',
      'text-background-opacity': 0.55,
      'text-background-padding': '4px',
      'text-background-shape': 'round-rectangle',
      width: 60,
      height: 60,
      'background-color': '#94A3B8',
      'border-width': 2.5,
      'border-color': '#1E293B',
    },
  },
  {
    selector: 'node[?es_central]',
    style: {
      width: 110,
      height: 110,
      'background-color': '#60A5FA',
      'border-color': '#93C5FD',
      'border-width': 5,
      'font-size': '15px',
      'font-weight': 700,
    },
  },
  { selector: 'node[tipo="proveedor"]', style: { 'background-color': '#22D3EE', 'border-color': '#67E8F9' } },
  {
    selector: 'node[tipo="contrato"]',
    style: { 'background-color': '#C084FC', 'border-color': '#D8B4FE', shape: 'round-rectangle', width: 70, height: 48 },
  },
  { selector: 'node[tipo="persona"]', style: { 'background-color': '#F0ABFC', 'border-color': '#F5D0FE', shape: 'ellipse' } },
  { selector: 'node[tipo="consorcio"]', style: { 'background-color': '#4ADE80', 'border-color': '#86EFAC', shape: 'hexagon' } },
  {
    selector: 'node[tipo="sancion"]',
    style: { 'background-color': '#FB7185', 'border-color': '#FDA4AF', shape: 'triangle', width: 52, height: 52 },
  },
  { selector: 'node[tipo="pep"]', style: { 'background-color': '#FCD34D', 'border-color': '#FDE68A', shape: 'star', width: 52, height: 52 } },
  {
    selector: 'node[nivel_riesgo="alto"]',
    style: { 'border-color': '#FCA5A5', 'border-width': 4 },
  },
  {
    selector: 'node:selected',
    style: { 'border-color': '#FACC15', 'border-width': 5, 'overlay-opacity': 0.18, 'overlay-color': '#FACC15' },
  },
  {
    selector: 'edge',
    style: {
      width: 1.8,
      'line-color': '#64748B',
      'target-arrow-color': '#94A3B8',
      'target-arrow-shape': 'triangle',
      'arrow-scale': 1,
      'curve-style': 'bezier',
      opacity: 0.9,
    },
  },
  {
    selector: 'edge[tipo="representante_legal"], edge[tipo="miembro_de"]',
    style: { 'line-style': 'dashed', 'line-color': '#C4B5FD', 'target-arrow-color': '#C4B5FD' },
  },
  {
    selector: 'edge[tipo="sancionado"], edge[tipo="alerta"]',
    style: { 'line-color': '#FB7185', 'target-arrow-color': '#FB7185', width: 2.4 },
  },
  {
    selector: 'edge:selected',
    style: { 'line-color': '#FACC15', 'target-arrow-color': '#FACC15', width: 3.2 },
  },
  { selector: '.faded', style: { opacity: 0.18 } },
]

export const layoutConfig = {
  name: 'cose-bilkent',
  animate: 'end' as const,
  animationDuration: 700,
  nodeDimensionsIncludeLabels: true,
  randomize: false,
  fit: true,
  padding: 24,
  idealEdgeLength: 110,
  edgeElasticity: 0.45,
  nestingFactor: 0.1,
  gravity: 0.3,
  numIter: 2500,
  tile: true,
}

export const INITIAL_ZOOM_BOOST = 1.35
