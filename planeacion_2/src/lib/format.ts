export function formatCOP(valor?: number) {
  if (valor === undefined || valor === null) return '—';
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);
}

export function formatNumero(valor?: number) {
  if (valor === undefined || valor === null) return '—';
  return new Intl.NumberFormat('es-CO').format(valor);
}

export function formatFecha(iso?: string) {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso));
  } catch {
    return iso;
  }
}
