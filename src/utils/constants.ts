import type { RiskLevel, Severity } from '@/types/shared.types'

export const RISK_COLORS: Record<RiskLevel, string> = {
  'CRÍTICO': '#DC2626',
  'ALTO': '#EF4444',
  'MEDIO': '#F59E0B',
  'BAJO': '#10B981',
}

export const RISK_BG_CLASSES: Record<RiskLevel, string> = {
  'CRÍTICO': 'bg-red-100 text-red-700 border-red-200',
  'ALTO': 'bg-red-50 text-red-600 border-red-100',
  'MEDIO': 'bg-orange-50 text-orange-600 border-orange-100',
  'BAJO': 'bg-green-50 text-green-600 border-green-100',
}

export const SEVERITY_COLORS: Record<Severity, string> = {
  'CRÍTICA': '#DC2626',
  'ALTA': '#F97316',
  'MEDIA': '#FBBF24',
  'BAJA': '#84CC16',
}

export const SEVERITY_BG_CLASSES: Record<Severity, string> = {
  'CRÍTICA': 'bg-red-100 text-red-700 border-red-200',
  'ALTA': 'bg-orange-100 text-orange-700 border-orange-200',
  'MEDIA': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'BAJA': 'bg-lime-100 text-lime-700 border-lime-200',
}

export const DEPARTAMENTOS = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar',
  'Boyacá', 'Caldas', 'Caquetá', 'Casanare', 'Cauca',
  'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca', 'Guainía',
  'Guaviare', 'Huila', 'La Guajira', 'Magdalena', 'Meta',
  'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda',
  'San Andrés', 'Santander', 'Sucre', 'Tolima', 'Valle del Cauca',
  'Vaupés', 'Vichada',
]

export const MODALIDADES = [
  'Licitación Pública', 'Selección Abreviada', 'Concurso de Méritos',
  'Contratación Directa', 'Mínima Cuantía', 'Asociación Público Privada',
]

export const ROUTES = {
  DASHBOARD: '/dashboard',
  CONTRATOS: '/contratos',
  CONTRATO_DETALLE: '/contratos/:id',
  ANALISIS: '/analisis/:id',
  ALERTAS: '/alertas',
  ALERTA_DETALLE: '/alertas/:id',
  MAPA_RELACIONES: '/mapa-relaciones',
  REPORTES: '/reportes',
  REPORTE_DETALLE: '/reportes/:id',
  CONFIGURACION: '/configuracion',
}

export const NODO_COLORS = {
  entidad: '#60A5FA',
  proveedor: '#22D3EE',
  contrato: '#C084FC',
  persona: '#F0ABFC',
  consorcio: '#4ADE80',
  sancion: '#FB7185',
  pep: '#FCD34D',
} as const
