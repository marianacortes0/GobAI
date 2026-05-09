# 🎨 Planeación Frontend — Mapa de Relaciones GobIA Auditor

**Repo:** `gob-ai.vercel.app`
**Stack asumido:** Next.js (App Router) + React + Tailwind
**Objetivo:** Construir la vista interactiva del grafo en `/dashboard/mapa-de-relaciones`

---

## 🧰 Dependencias a instalar

```bash
npm install cytoscape react-cytoscapejs
npm install cytoscape-cose-bilkent       # layout radial
npm install cytoscape-popper              # tooltips
npm install @tanstack/react-query         # cache de llamadas
npm install lucide-react                  # iconos (ya lo tienes probablemente)
npm install html-to-image                 # exportar a PNG
npm install jspdf                         # exportar a PDF
```

**Nota:** Cytoscape NO funciona con SSR de Next.js. Hay que cargarlo dinámicamente.

---

## 📁 Estructura de archivos

```
app/
└── dashboard/
    └── mapa-de-relaciones/
        ├── page.tsx                    # Server component (lee searchParams)
        ├── MapaContainer.tsx           # 'use client' wrapper
        ├── components/
        │   ├── GrafoCytoscape.tsx      # Componente del grafo (dynamic import)
        │   ├── FiltrosBar.tsx          # Dropdowns superiores
        │   ├── PanelDetalle.tsx        # Side panel al click en nodo
        │   ├── LeyendaNodos.tsx        # Leyenda inferior izquierda
        │   ├── MiniMapa.tsx            # Mini-mapa esquina inferior derecha
        │   └── ControlesZoom.tsx       # Botones +/- y fit
        ├── hooks/
        │   ├── useGrafo.ts             # React Query hook
        │   └── useGrafoFiltros.ts      # Estado de filtros con URL sync
        ├── lib/
        │   ├── cytoscape-config.ts     # Estilos y layout config
        │   ├── transform-data.ts       # JSON del API → formato Cytoscape
        │   └── export-grafo.ts         # PNG/PDF export
        └── types.ts                    # Tipos TypeScript del grafo
```

---

## 🎯 Sprint 2 — Frontend del grafo (5–7 días)

### Día 1 — Estructura base y mock

**Objetivo:** Tener la página renderizando con data mock antes de que backend esté listo.

```tsx
// app/dashboard/mapa-de-relaciones/page.tsx
import MapaContainer from './MapaContainer';

export default function MapaRelacionesPage({
  searchParams
}: {
  searchParams: { entidad?: string; tipo?: string; periodo?: string }
}) {
  return (
    <div className="flex flex-col h-screen bg-slate-900">
      <h1 className="text-2xl font-bold text-white p-6">Mapa de relaciones</h1>
      <MapaContainer initialFilters={searchParams} />
    </div>
  );
}
```

```tsx
// MapaContainer.tsx
'use client';

import dynamic from 'next/dynamic';
import { FiltrosBar } from './components/FiltrosBar';
import { LeyendaNodos } from './components/LeyendaNodos';

// CRÍTICO: Cytoscape solo en cliente
const GrafoCytoscape = dynamic(
  () => import('./components/GrafoCytoscape'),
  { ssr: false, loading: () => <SkeletonGrafo /> }
);

export default function MapaContainer({ initialFilters }) {
  const [filtros, setFiltros] = useState(initialFilters);
  const [nodoSeleccionado, setNodoSeleccionado] = useState(null);

  return (
    <div className="relative flex-1">
      <FiltrosBar filtros={filtros} onChange={setFiltros} />
      <GrafoCytoscape
        filtros={filtros}
        onNodeClick={setNodoSeleccionado}
      />
      <LeyendaNodos />
      {nodoSeleccionado && (
        <PanelDetalle nodo={nodoSeleccionado} onClose={() => setNodoSeleccionado(null)} />
      )}
    </div>
  );
}
```

### Día 2 — Componente Cytoscape

```tsx
// components/GrafoCytoscape.tsx
'use client';

import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';
import { useGrafo } from '../hooks/useGrafo';
import { transformToCytoscape } from '../lib/transform-data';
import { stylesheet, layoutConfig } from '../lib/cytoscape-config';

cytoscape.use(coseBilkent);

export default function GrafoCytoscape({ filtros, onNodeClick }) {
  const { data, isLoading } = useGrafo(filtros);

  if (isLoading) return <SkeletonGrafo />;
  if (!data) return <EmptyState />;

  const elements = transformToCytoscape(data);

  return (
    <CytoscapeComponent
      elements={elements}
      stylesheet={stylesheet}
      layout={layoutConfig}
      style={{ width: '100%', height: '100%' }}
      cy={(cy) => {
        cy.on('tap', 'node', (evt) => onNodeClick(evt.target.data()));
      }}
    />
  );
}
```

### Día 3 — Estilos y layout (la parte visual)

```ts
// lib/cytoscape-config.ts
export const stylesheet = [
  // Estilo base de nodos
  {
    selector: 'node',
    style: {
      'label': 'data(label)',
      'color': '#fff',
      'font-size': '11px',
      'text-valign': 'bottom',
      'text-margin-y': 8,
      'width': 50,
      'height': 50,
      'background-color': 'data(color)',
      'border-width': 2,
      'border-color': '#1e293b'
    }
  },
  // Nodo central (entidad)
  {
    selector: 'node[?es_central]',
    style: {
      'width': 80,
      'height': 80,
      'background-color': '#3B82F6',
      'border-color': '#60A5FA',
      'border-width': 4
    }
  },
  // Nodos por tipo
  {
    selector: 'node[tipo="proveedor"]',
    style: { 'background-color': '#06B6D4' }
  },
  {
    selector: 'node[tipo="contrato"]',
    style: { 'background-color': '#A855F7', 'shape': 'round-rectangle' }
  },
  {
    selector: 'node[tipo="persona"]',
    style: { 'background-color': '#8B5CF6' }
  },
  {
    selector: 'node[tipo="sancion"]',
    style: { 'background-color': '#EF4444', 'shape': 'triangle' }
  },
  // Nodos con riesgo alto
  {
    selector: 'node[nivel_riesgo="alto"]',
    style: {
      'border-color': '#EF4444',
      'border-width': 3
    }
  },
  // Aristas base
  {
    selector: 'edge',
    style: {
      'width': 2,
      'line-color': '#475569',
      'target-arrow-color': '#475569',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier'
    }
  },
  // Aristas punteadas (rep legal, socio)
  {
    selector: 'edge[tipo="representante_legal"], edge[tipo="miembro_de"]',
    style: {
      'line-style': 'dashed',
      'line-color': '#8B5CF6'
    }
  },
  // Aristas de sanción
  {
    selector: 'edge[tipo="sancionado"]',
    style: { 'line-color': '#EF4444' }
  }
];

export const layoutConfig = {
  name: 'cose-bilkent',
  animate: true,
  animationDuration: 1000,
  nodeDimensionsIncludeLabels: true,
  randomize: false,
  fit: true,
  padding: 50,
  idealEdgeLength: 120,
  edgeElasticity: 0.45,
  nestingFactor: 0.1,
  gravity: 0.25,
  numIter: 2500
};
```

### Día 4 — Hook de datos con React Query

```ts
// hooks/useGrafo.ts
import { useQuery } from '@tanstack/react-query';

const API = process.env.NEXT_PUBLIC_API_URL;

export function useGrafo(filtros) {
  return useQuery({
    queryKey: ['grafo', filtros],
    queryFn: async () => {
      const params = new URLSearchParams(filtros).toString();
      const res = await fetch(`${API}/api/v1/relaciones/grafo?${params}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (!res.ok) throw new Error('Error al cargar grafo');
      return res.json();
    },
    staleTime: 60_000, // 1 minuto
    enabled: !!filtros.entidad_id
  });
}
```

### Día 5 — Filtros, panel detalle y leyenda

**FiltrosBar** — los 4 dropdowns superiores que se ven en el mockup:

```tsx
export function FiltrosBar({ filtros, onChange }) {
  return (
    <div className="flex gap-3 px-6 py-4 bg-slate-800 border-b border-slate-700">
      <SelectEntidad value={filtros.entidad_id} onChange={(v) => onChange({...filtros, entidad_id: v})} />
      <SelectTipoRelacion value={filtros.tipo_relacion} onChange={...} />
      <SelectPeriodo value={filtros.periodo} onChange={...} />
      <SelectRiesgo value={filtros.nivel_riesgo} onChange={...} />
      <button className="ml-auto btn-primary">Exportar grafo</button>
    </div>
  );
}
```

**PanelDetalle** — slide-in lateral cuando se hace click en un nodo:

```tsx
export function PanelDetalle({ nodo, onClose }) {
  // Llama a /api/v1/contracts/{id} o /proveedores/{nit} según el tipo
  const { data: detalle } = useQuery({
    queryKey: ['detalle', nodo.id],
    queryFn: () => fetchDetalleByTipo(nodo.tipo, nodo.id)
  });

  return (
    <aside className="absolute right-0 top-0 h-full w-96 bg-slate-800 border-l border-slate-700 p-6 overflow-y-auto">
      <button onClick={onClose}>×</button>
      <h2>{nodo.label}</h2>
      <Tabs>
        <Tab label="Información">{/* metadata */}</Tab>
        <Tab label="Alertas">{/* alertas relacionadas */}</Tab>
        <Tab label="Conexiones">{/* otros nodos relacionados */}</Tab>
      </Tabs>
    </aside>
  );
}
```

### Día 6 — Mini-mapa, exportación y URL sync

**Mini-mapa** (esquina inferior derecha):

```tsx
// Cytoscape no trae minimap nativo, usar cytoscape-navigator
import navigator from 'cytoscape-navigator';
cytoscape.use(navigator);

// En el componente:
useEffect(() => {
  if (cy) cy.navigator({ container: '#minimapa' });
}, [cy]);
```

**Exportar a PNG/PDF:**

```ts
// lib/export-grafo.ts
export async function exportarGrafo(cy, formato: 'png' | 'pdf') {
  const png = cy.png({ output: 'blob', scale: 2, bg: '#0f172a' });

  if (formato === 'png') {
    descargar(png, 'mapa-relaciones.png');
  } else {
    const pdf = new jsPDF('landscape');
    pdf.addImage(URL.createObjectURL(png), 'PNG', 10, 10, 280, 180);
    pdf.save('mapa-relaciones.pdf');
  }
}
```

**Sincronizar filtros con URL** (para que sea compartible):

```ts
// hooks/useGrafoFiltros.ts
export function useGrafoFiltros() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filtros = {
    entidad_id: searchParams.get('entidad') ?? '',
    tipo_relacion: searchParams.get('tipo') ?? 'todos',
    periodo: searchParams.get('periodo') ?? '12m',
    nivel_riesgo: searchParams.get('riesgo') ?? 'todos'
  };

  const setFiltros = (nuevos) => {
    const params = new URLSearchParams(nuevos).toString();
    router.push(`?${params}`);
  };

  return [filtros, setFiltros];
}
```

### Día 7 — Performance, edge cases y polish

- **Loading state:** skeleton del grafo con shimmer
- **Empty state:** "Selecciona una entidad para ver sus relaciones"
- **Error state:** retry button
- **Grafo denso (>200 nodos):** botón "Agrupar proveedores menores" que colapsa nodos con valor < umbral
- **Accesibilidad:** navegación por teclado en filtros, alt text en exportaciones

---

## 🔌 Conexión con endpoints existentes

| Acción del usuario | Endpoint a llamar |
|---|---|
| Cargar página inicial | `GET /api/v1/entities/` (poblar dropdown) |
| Cargar grafo | `GET /api/v1/relaciones/grafo?entidad_id=...` ⭐ NUEVO |
| Click en nodo de contrato | `GET /api/v1/contracts/{id}` ✅ EXISTE |
| Click en nodo de proveedor | `GET /api/v1/proveedores/{nit}` ⭐ NUEVO |
| Click en nodo de persona | `GET /api/v1/personas/{cedula}` ⭐ NUEVO |
| Ver alertas de un nodo | `GET /api/v1/alertas/?contrato_id=...` ✅ EXISTE |
| Buscar en barra superior | `GET /api/v1/buscar?q=...` ⭐ NUEVO |
| Exportar grafo | `POST /api/v1/reportes/generar` ✅ EXISTE |
| Badge de alertas en sidebar | `GET /api/v1/alertas/stats` ✅ EXISTE |

---

## 🎨 Detalles de diseño que matchean el mockup

**Fondo:** Gradiente oscuro `bg-slate-900` con sutil noise pattern.

**Contenedor del grafo:** `bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl`.

**Colores de nodos (matchean el mockup):**
- Entidad central: azul brillante `#3B82F6`
- Proveedor: cian `#06B6D4`
- Contrato: morado `#A855F7`
- Persona: violeta `#8B5CF6`
- UT/Consorcio: verde `#10B981`
- Sanción/Multa: rojo `#EF4444`
- Alerta PEP: amarillo `#F59E0B`

**Tooltip al hover:** badge flotante con nombre del nodo + nivel de riesgo + número de conexiones.

**Animación inicial:** los nodos hacen fade-in desde el centro hacia su posición final.

---

## ⚡ Estrategia para avanzar SIN backend listo

Mientras backend construye `/relaciones/grafo`, frontend puede avanzar en paralelo usando:

1. **Mock estático:** importa el archivo `grafo-relaciones-ejemplo.json` directamente.
2. **MSW (Mock Service Worker):** intercepta las llamadas y devuelve el JSON.

```ts
// hooks/useGrafo.ts (versión mock)
import grafoMock from '@/mocks/grafo-relaciones-ejemplo.json';

export function useGrafo(filtros) {
  return useQuery({
    queryKey: ['grafo', filtros],
    queryFn: async () => {
      if (process.env.NEXT_PUBLIC_USE_MOCK === 'true') {
        await new Promise(r => setTimeout(r, 500)); // simular latencia
        return grafoMock;
      }
      // llamada real cuando backend esté listo
      const params = new URLSearchParams(filtros).toString();
      return fetch(`${API}/api/v1/relaciones/grafo?${params}`).then(r => r.json());
    }
  });
}
```

Esto te permite tener una demo funcionando en 2-3 días, antes de que backend termine.

---

## ⚠️ Errores comunes a evitar

**1. SSR rompe Cytoscape**
Síntoma: `ReferenceError: window is not defined` o `document is not defined`.
Solución: SIEMPRE `dynamic(() => import('...'), { ssr: false })`.

**2. Re-renders del grafo en cada filtro**
Síntoma: el grafo se redibuja desde cero al cambiar un filtro.
Solución: usar `cy.elements().remove()` + `cy.add(elementos)` en lugar de remontar el componente.

**3. Layout se ve mal en grafos grandes**
Síntoma: nodos amontonados o el grafo se sale del viewport.
Solución: ajustar `idealEdgeLength` y llamar `cy.fit()` después del layout.

**4. Performance con muchos nodos**
Síntoma: lag al hacer pan/zoom con > 500 nodos.
Solución: activar `hideEdgesOnViewport: true` y `textureOnViewport: true` en el config inicial.

---

## 📅 Cronograma resumido

| Día | Tarea | Entregable visible |
|---|---|---|
| 1 | Estructura + mock data | Página vacía con layout |
| 2 | Cytoscape básico | Grafo dibuja nodos y aristas |
| 3 | Estilos + layout cose-bilkent | Grafo se ve como el mockup |
| 4 | React Query + endpoints reales | Grafo conectado a backend (o mock) |
| 5 | Filtros + panel detalle + leyenda | Interactividad completa |
| 6 | Minimap + exportación + URL sync | Features del mockup completas |
| 7 | Performance + edge cases + polish | Producción ready |

---

## ✅ Definition of Done — Sprint 2

- [ ] Ruta `/dashboard/mapa-de-relaciones` funcional
- [ ] Grafo renderiza correctamente con data del backend
- [ ] 4 filtros funcionando con sync a URL
- [ ] Click en nodo abre panel de detalle con info real
- [ ] Leyenda inferior izquierda visible
- [ ] Mini-mapa esquina inferior derecha
- [ ] Botón "Exportar grafo" genera PNG y PDF
- [ ] Badge de alertas en sidebar (con `/alertas/stats`)
- [ ] Loading, empty y error states
- [ ] Lighthouse Performance > 80
- [ ] Funciona en Chrome, Firefox, Safari
- [ ] Deploy a Vercel exitoso
