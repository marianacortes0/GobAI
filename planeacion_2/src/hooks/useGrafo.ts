import { useQuery } from '@tanstack/react-query';
import grafoMock from '@/mocks/grafo-relaciones-ejemplo.json';
import type { FiltrosGrafo, GrafoData } from '@/types';
import { aplicaFiltrosCliente } from '@/lib/transform-data';

const API = import.meta.env.VITE_API_URL ?? '';
const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') === 'true';

async function fetchGrafoApi(filtros: FiltrosGrafo): Promise<GrafoData> {
  const params = new URLSearchParams({
    entidad_id: filtros.entidad_id,
    tipo_relacion: filtros.tipo_relacion,
    periodo: filtros.periodo,
    nivel_riesgo: filtros.nivel_riesgo,
  });
  const res = await fetch(`${API}/api/v1/relaciones/grafo?${params.toString()}`);
  if (!res.ok) throw new Error(`Error al cargar grafo: ${res.status}`);
  return (await res.json()) as GrafoData;
}

export function useGrafo(filtros: FiltrosGrafo) {
  return useQuery<GrafoData>({
    queryKey: ['grafo', filtros],
    queryFn: async () => {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 350));
        return aplicaFiltrosCliente(grafoMock as GrafoData, filtros);
      }
      return fetchGrafoApi(filtros);
    },
    enabled: !!filtros.entidad_id,
  });
}

export function useDetalleNodo(tipo: string | undefined, id: string | undefined) {
  return useQuery({
    queryKey: ['detalle', tipo, id],
    enabled: !!tipo && !!id,
    queryFn: async () => {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 200));
        return null;
      }
      const endpoint = mapEndpointPorTipo(tipo!, id!);
      const res = await fetch(`${API}${endpoint}`);
      if (!res.ok) throw new Error('Error al cargar detalle');
      return res.json();
    },
  });
}

function mapEndpointPorTipo(tipo: string, id: string) {
  switch (tipo) {
    case 'contrato':
      return `/api/v1/contracts/${id}`;
    case 'proveedor':
      return `/api/v1/proveedores/${id}`;
    case 'persona':
      return `/api/v1/personas/${id}`;
    default:
      return `/api/v1/entities/${id}`;
  }
}
