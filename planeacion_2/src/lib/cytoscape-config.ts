import type { Stylesheet } from 'cytoscape';

export const stylesheet: Stylesheet[] = [
  {
    selector: 'node',
    style: {
      label: 'data(label)',
      color: '#E2E8F0',
      'font-size': '11px',
      'font-weight': 500,
      'text-valign': 'bottom',
      'text-halign': 'center',
      'text-margin-y': 8,
      'text-outline-color': '#0f172a',
      'text-outline-width': 2,
      width: 50,
      height: 50,
      'background-color': '#64748B',
      'border-width': 2,
      'border-color': '#1e293b',
    },
  },
  {
    selector: 'node[?es_central]',
    style: {
      width: 90,
      height: 90,
      'background-color': '#3B82F6',
      'border-color': '#60A5FA',
      'border-width': 4,
      'font-size': '13px',
      'font-weight': 700,
    },
  },
  { selector: 'node[tipo="proveedor"]', style: { 'background-color': '#06B6D4' } },
  { selector: 'node[tipo="contrato"]', style: { 'background-color': '#A855F7', shape: 'round-rectangle', width: 60, height: 40 } },
  { selector: 'node[tipo="persona"]', style: { 'background-color': '#8B5CF6', shape: 'ellipse' } },
  { selector: 'node[tipo="consorcio"]', style: { 'background-color': '#10B981', shape: 'hexagon' } },
  { selector: 'node[tipo="sancion"]', style: { 'background-color': '#EF4444', shape: 'triangle', width: 44, height: 44 } },
  { selector: 'node[tipo="pep"]', style: { 'background-color': '#F59E0B', shape: 'star', width: 44, height: 44 } },
  {
    selector: 'node[nivel_riesgo="alto"]',
    style: { 'border-color': '#EF4444', 'border-width': 3 },
  },
  {
    selector: 'node:selected',
    style: { 'border-color': '#FACC15', 'border-width': 4, 'overlay-opacity': 0.15, 'overlay-color': '#FACC15' },
  },
  {
    selector: 'edge',
    style: {
      width: 1.6,
      'line-color': '#475569',
      'target-arrow-color': '#64748B',
      'target-arrow-shape': 'triangle',
      'arrow-scale': 0.9,
      'curve-style': 'bezier',
      opacity: 0.85,
    },
  },
  {
    selector: 'edge[tipo="representante_legal"], edge[tipo="miembro_de"]',
    style: { 'line-style': 'dashed', 'line-color': '#8B5CF6', 'target-arrow-color': '#8B5CF6' },
  },
  {
    selector: 'edge[tipo="sancionado"], edge[tipo="alerta"]',
    style: { 'line-color': '#EF4444', 'target-arrow-color': '#EF4444', width: 2 },
  },
  {
    selector: 'edge:selected',
    style: { 'line-color': '#FACC15', 'target-arrow-color': '#FACC15', width: 3 },
  },
  {
    selector: '.faded',
    style: { opacity: 0.15 },
  },
];

export const layoutConfig = {
  name: 'cose-bilkent',
  animate: 'end' as const,
  animationDuration: 800,
  nodeDimensionsIncludeLabels: true,
  randomize: false,
  fit: true,
  padding: 60,
  idealEdgeLength: 130,
  edgeElasticity: 0.45,
  nestingFactor: 0.1,
  gravity: 0.25,
  numIter: 2500,
  tile: true,
};
