# 🗺️ Mapa de relaciones — Prototipo standalone

Implementación standalone (Vite + React + TypeScript + Tailwind) del feature **Mapa de relaciones** de GobIA Auditor, basado en `PLAN-FRONTEND.md` y el mockup `image.png`.

> **Aislado:** este proyecto vive en `planeacion_2/` y no toca el repo `GobAI/`. Cuando esté validado se puede portar al repo principal.

## Stack

- Vite 5 + React 18 + TypeScript
- Tailwind CSS
- Cytoscape.js + `cose-bilkent` (layout) + `cytoscape-navigator` (mini-mapa)
- React Query (cache/fetch)
- React Router (URL sync de filtros)
- jsPDF + html-to-image (exportar)

## Cómo correrlo

```bash
cd planeacion_2
npm install
npm run dev
```

Abre `http://localhost:5173`. Por defecto usa datos mock (`VITE_USE_MOCK=true` en `.env.example`).

Para conectarlo al backend real:

```bash
cp .env.example .env
# edita .env y pon VITE_USE_MOCK=false + tu VITE_API_URL
```

## Estructura

```
planeacion_2/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── src/
    ├── main.tsx                # entry: QueryClient + Router
    ├── App.tsx                 # rutas
    ├── pages/
    │   └── MapaRelacionesPage.tsx
    ├── components/
    │   ├── MapaContainer.tsx       # orquesta filtros, grafo, panel
    │   ├── GrafoCytoscape.tsx      # lazy-loaded, interacción nodo
    │   ├── FiltrosBar.tsx          # 4 dropdowns + exportar
    │   ├── PanelDetalle.tsx        # slide-in con tabs
    │   ├── LeyendaNodos.tsx
    │   ├── MiniMapa.tsx
    │   ├── ControlesZoom.tsx
    │   ├── SkeletonGrafo.tsx       # loading state
    │   ├── EmptyState.tsx
    │   └── ErrorState.tsx
    ├── hooks/
    │   ├── useGrafo.ts             # React Query + mock fallback
    │   └── useGrafoFiltros.ts      # estado en URL
    ├── lib/
    │   ├── cytoscape-config.ts     # stylesheet + layout
    │   ├── transform-data.ts       # JSON → ElementDefinition
    │   ├── export-grafo.ts         # PNG / PDF
    │   └── format.ts               # COP, fechas, números
    ├── mocks/
    │   └── grafo-relaciones-ejemplo.json
    ├── types.ts
    └── styles.css
```

## Definition of Done — alineado al PLAN-FRONTEND.md

- [x] Página renderiza el grafo con datos (mock o reales)
- [x] 4 filtros (entidad, relación, periodo, riesgo) con sync a URL
- [x] Click en nodo abre panel lateral con tabs (Información / Alertas / Conexiones)
- [x] Leyenda inferior izquierda
- [x] Mini-mapa esquina inferior derecha
- [x] Controles de zoom (+/–/fit)
- [x] Botón "Exportar grafo" → PNG y PDF
- [x] Loading, empty y error states
- [x] Sidebar y top-bar como en el mockup (con badge de alertas)
- [x] Highlight de vecinos al seleccionar un nodo (resto se atenúa)

## Conexión con el backend (cuando esté listo)

| Acción | Endpoint |
|---|---|
| Cargar grafo | `GET /api/v1/relaciones/grafo?entidad_id=…` |
| Detalle contrato | `GET /api/v1/contracts/{id}` |
| Detalle proveedor | `GET /api/v1/proveedores/{nit}` |
| Detalle persona | `GET /api/v1/personas/{cedula}` |

`useGrafo.ts` ya conmuta automáticamente entre mock y API real según `VITE_USE_MOCK`.

## Qué NO está hecho (fuera de alcance de este prototipo)

- Autenticación real (no se envía `Authorization: Bearer …`); cuando se porte al repo principal, agregar el token al fetch en `useGrafo.ts`.
- Tests automatizados.
- Búsqueda funcional en la barra superior (queda como input visual).
- Agrupación de proveedores menores (mejora del Día 7 del plan).
