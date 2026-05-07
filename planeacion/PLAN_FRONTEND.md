# 🎨 PLAN DE DESARROLLO FRONTEND — GobIA Auditor

**Proyecto**: `gobia-auditor-frontend`  
**Versión**: 2.0 (Reformulado basado en wireframes)  
**Estado**: ✅ LISTO PARA INICIAR  
**Duración estimada**: 5-6 semanas  
**Equipo**: 1-2 Frontend Devs + 1 UX/UI Designer  
**Stakeholders**: Backend Team, QA, Product Owner

---

## 📋 ÍNDICE

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura del Frontend](#arquitectura-del-frontend)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Análisis de los 6 Wireframes](#análisis-de-los-6-wireframes)
6. [Sistema de Diseño](#sistema-de-diseño)
7. [Componentes Reutilizables](#componentes-reutilizables)
8. [Páginas y Rutas](#páginas-y-rutas)
9. [Fases de Desarrollo](#fases-de-desarrollo)
10. [Testing](#testing)
11. [Deployment](#deployment)

---

## 🎯 RESUMEN EJECUTIVO

### **Objetivo**

Construir una aplicación web moderna e intuitiva que permita visualizar y gestionar el análisis de 99,353 contratos públicos colombianos, con 6 interfaces principales según los wireframes provistos.

### **Inputs**

✅ Wireframes de 6 interfaces (Dashboard, Contratos, Análisis IA, Alertas, Reportes, Configuración)  
✅ Backend API REST con ~40 endpoints  
✅ Sistema de autenticación JWT  
✅ Datos de 99,353 contratos enriquecidos

### **Outputs Esperados**

✅ Aplicación React + TypeScript responsive  
✅ 6 páginas principales completamente funcionales  
✅ ~40 componentes reutilizables  
✅ Sistema de diseño consistente  
✅ Tests unitarios + E2E (>80% coverage)  
✅ PWA-ready (Progressive Web App)

---

## 🏗️ ARQUITECTURA DEL FRONTEND

```
┌──────────────────────────────────────────────────────────┐
│                     APLICACIÓN React                     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │            ROUTING (React Router v6)               │ │
│  │   /login                                           │ │
│  │   /dashboard                                       │ │
│  │   /contratos                                       │ │
│  │   /contratos/:id                                   │ │
│  │   /analisis/:id                                    │ │
│  │   /alertas                                         │ │
│  │   /alertas/:id                                     │ │
│  │   /reportes                                        │ │
│  │   /reportes/:id                                    │ │
│  │   /configuracion                                   │ │
│  └────────────────────────────────────────────────────┘ │
│                         │                                │
│                         ▼                                │
│  ┌────────────────────────────────────────────────────┐ │
│  │                  LAYOUT                            │ │
│  │  ┌──────────┬───────────────────┬──────────────┐  │ │
│  │  │ Sidebar  │   Main Content    │  Right Panel │  │ │
│  │  │ (fixed)  │  (page content)   │  (detalle)   │  │ │
│  │  └──────────┴───────────────────┴──────────────┘  │ │
│  └────────────────────────────────────────────────────┘ │
│                         │                                │
│                         ▼                                │
│  ┌────────────────────────────────────────────────────┐ │
│  │              STATE MANAGEMENT                      │ │
│  │  ├─ TanStack Query (Server State)                 │ │
│  │  ├─ Zustand (Client State)                        │ │
│  │  └─ Context API (Auth, Theme)                     │ │
│  └────────────────────────────────────────────────────┘ │
│                         │                                │
│                         ▼                                │
│  ┌────────────────────────────────────────────────────┐ │
│  │              API CLIENT (Axios)                    │ │
│  │  - Interceptors para JWT                          │ │
│  │  - Error handling global                          │ │
│  │  - Request/Response transformers                  │ │
│  └────────────────────────────────────────────────────┘ │
│                         │                                │
└─────────────────────────┼────────────────────────────────┘
                          │
                          ▼ HTTPS
              ┌───────────────────────┐
              │   Backend API (8000)  │
              └───────────────────────┘
```

---

## 💻 STACK TECNOLÓGICO

### **Core**

| Componente | Tecnología | Versión | Propósito |
|---|---|---|---|
| Framework | React | 18.2+ | UI Library |
| Language | TypeScript | 5.3+ | Type safety |
| Build Tool | Vite | 5.0+ | Dev + Build |
| Routing | React Router | 6.20+ | Client routing |

### **Estilización**

| Componente | Tecnología | Propósito |
|---|---|---|
| CSS Framework | Tailwind CSS 3.4+ | Utility-first CSS |
| Component Library | shadcn/ui | Pre-built components |
| Icons | Lucide React | Icons |
| Animations | Framer Motion | Animations |

### **State Management**

```typescript
// Server state
TanStack Query (React Query) v5+

// Client state (filtros, UI)
Zustand v4+

// Auth context
React Context API
```

### **Data & Forms**

```typescript
Axios v1.6+        // HTTP client
React Hook Form    // Forms
Zod                // Schema validation
date-fns           // Date manipulation
```

### **Charts & Visualization**

```typescript
Recharts v2+       // Charts (donut, bar, line)
ApexCharts         // Backup charts
```

### **Testing**

```typescript
Vitest             // Unit tests (Jest-compatible)
React Testing Library  // Component tests
MSW (Mock Service Worker)  // API mocking
Playwright         // E2E tests
```

### **DevOps**

```yaml
Docker: 24+
Nginx: alpine
GitHub Actions: CI/CD
```

---

## 📁 ESTRUCTURA DEL PROYECTO

```
gobia-auditor-frontend/
│
├── src/
│   ├── main.tsx                          # Entry point
│   ├── App.tsx                           # Root component
│   ├── vite-env.d.ts
│   │
│   ├── pages/                            # 7 Páginas principales
│   │   ├── LoginPage/
│   │   │   ├── index.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   └── LoginPage.test.tsx
│   │   │
│   │   ├── DashboardPage/                # Image 6
│   │   │   ├── index.tsx
│   │   │   ├── components/
│   │   │   │   ├── KPICards.tsx
│   │   │   │   ├── FiltersPanel.tsx
│   │   │   │   ├── PrioritizedTable.tsx
│   │   │   │   └── DetailSidebar.tsx
│   │   │   └── DashboardPage.test.tsx
│   │   │
│   │   ├── ContratosPage/                # Image 5
│   │   │   ├── index.tsx
│   │   │   ├── components/
│   │   │   │   ├── SearchBox.tsx
│   │   │   │   ├── FilterBar.tsx
│   │   │   │   ├── KPICards.tsx
│   │   │   │   ├── ContratosTable.tsx
│   │   │   │   ├── ContractTabs.tsx
│   │   │   │   └── ContractDetailPanel.tsx
│   │   │   └── ContratosPage.test.tsx
│   │   │
│   │   ├── AnalisisIAPage/               # Image 4
│   │   │   ├── index.tsx
│   │   │   ├── components/
│   │   │   │   ├── AnalysisHeader.tsx
│   │   │   │   ├── AnalysisInputs.tsx
│   │   │   │   ├── ScoreCards.tsx
│   │   │   │   ├── AnalysisTabs.tsx
│   │   │   │   ├── ExecutiveSummary.tsx
│   │   │   │   ├── WeightedFactors.tsx
│   │   │   │   ├── AnalysisTraceability.tsx
│   │   │   │   ├── KeyFindings.tsx
│   │   │   │   ├── TextualEvidence.tsx
│   │   │   │   ├── Recommendations.tsx
│   │   │   │   └── ResultSidebar.tsx
│   │   │   └── AnalisisIAPage.test.tsx
│   │   │
│   │   ├── AlertasPage/                  # Image 3
│   │   │   ├── index.tsx
│   │   │   ├── components/
│   │   │   │   ├── SearchAndFilters.tsx
│   │   │   │   ├── AlertsKPICards.tsx
│   │   │   │   ├── AlertsTabs.tsx
│   │   │   │   ├── AlertsTable.tsx
│   │   │   │   ├── AlertDetailSidebar.tsx
│   │   │   │   └── AlertActions.tsx
│   │   │   └── AlertasPage.test.tsx
│   │   │
│   │   ├── ReportesPage/                 # Image 2
│   │   │   ├── index.tsx
│   │   │   ├── components/
│   │   │   │   ├── ReportConfig.tsx
│   │   │   │   ├── ReportCoverage.tsx
│   │   │   │   ├── ReportKPICards.tsx
│   │   │   │   ├── ReportTabs.tsx
│   │   │   │   ├── ExecutiveSummary.tsx
│   │   │   │   ├── KeyIndicators.tsx
│   │   │   │   ├── RiskDistributionChart.tsx
│   │   │   │   ├── PrioritizedFindings.tsx
│   │   │   │   ├── AlertsByEntity.tsx
│   │   │   │   ├── RiskEvolutionChart.tsx
│   │   │   │   ├── InsightCards.tsx
│   │   │   │   └── ReportSidebar.tsx
│   │   │   └── ReportesPage.test.tsx
│   │   │
│   │   └── ConfiguracionPage/            # Image 1
│   │       ├── index.tsx
│   │       ├── components/
│   │       │   ├── ConfigTabs.tsx
│   │       │   ├── SystemStatusCards.tsx
│   │       │   ├── GeneralSection.tsx
│   │       │   ├── DataIntegrationSection.tsx
│   │       │   ├── RiskEngineSection.tsx
│   │       │   ├── AISection.tsx
│   │       │   ├── AlertsSection.tsx
│   │       │   ├── UsersSection.tsx
│   │       │   ├── BackupSection.tsx
│   │       │   ├── HistorySection.tsx
│   │       │   ├── SecuritySection.tsx
│   │       │   └── ConfigSummary.tsx
│   │       └── ConfiguracionPage.test.tsx
│   │
│   ├── components/                       # Componentes globales
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx             # Layout principal
│   │   │   ├── Sidebar.tsx               # Menú lateral
│   │   │   ├── Header.tsx                # Top bar
│   │   │   └── DataSourceFooter.tsx     # Footer info
│   │   │
│   │   ├── ui/                           # Atomic components (shadcn)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── ...
│   │   │
│   │   ├── common/                       # Componentes comunes
│   │   │   ├── DataTable/
│   │   │   │   ├── DataTable.tsx
│   │   │   │   ├── TableHeader.tsx
│   │   │   │   ├── TableRow.tsx
│   │   │   │   ├── Pagination.tsx
│   │   │   │   └── TableFilters.tsx
│   │   │   │
│   │   │   ├── KPICard.tsx               # Card numérica con trend
│   │   │   ├── RiskBadge.tsx             # Badge de riesgo (colores)
│   │   │   ├── SeverityBadge.tsx         # Badge de severidad
│   │   │   ├── StatusBadge.tsx           # Badge de estado
│   │   │   ├── ScoreCircle.tsx           # Círculo con score
│   │   │   ├── SearchBox.tsx             # Input de búsqueda
│   │   │   ├── FilterDropdown.tsx        # Dropdown de filtros
│   │   │   ├── DateRangePicker.tsx       # Selector de fechas
│   │   │   ├── EmptyState.tsx            # Estado vacío
│   │   │   ├── LoadingSpinner.tsx        # Spinner
│   │   │   ├── ErrorBoundary.tsx         # Error boundary
│   │   │   └── ConfirmDialog.tsx         # Diálogo de confirmación
│   │   │
│   │   ├── charts/                       # Visualizaciones
│   │   │   ├── DonutChart.tsx            # Distribución de riesgo
│   │   │   ├── HorizontalBarChart.tsx    # Indicadores
│   │   │   ├── LineChart.tsx             # Evolución
│   │   │   ├── ProgressBar.tsx           # Factores ponderados
│   │   │   └── EntityBarChart.tsx        # Alertas por entidad
│   │   │
│   │   ├── forms/                        # Formularios
│   │   │   ├── FormField.tsx
│   │   │   ├── FormSelect.tsx
│   │   │   ├── FormDatePicker.tsx
│   │   │   ├── FormSlider.tsx            # Para configuración
│   │   │   └── FormSwitch.tsx            # Toggles
│   │   │
│   │   └── auth/
│   │       ├── ProtectedRoute.tsx        # HOC de auth
│   │       └── RoleGuard.tsx             # Guard por rol
│   │
│   ├── hooks/                            # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useContratos.ts
│   │   ├── useAlertas.ts
│   │   ├── useReportes.ts
│   │   ├── useAnalisis.ts
│   │   ├── useConfiguracion.ts
│   │   ├── useFilters.ts
│   │   ├── usePagination.ts
│   │   ├── useDebounce.ts
│   │   └── useToast.ts
│   │
│   ├── services/                         # API services
│   │   ├── api.ts                        # Axios instance
│   │   ├── auth.service.ts
│   │   ├── dashboard.service.ts
│   │   ├── contratos.service.ts
│   │   ├── analisis.service.ts
│   │   ├── alertas.service.ts
│   │   ├── reportes.service.ts
│   │   ├── configuracion.service.ts
│   │   └── usuarios.service.ts
│   │
│   ├── store/                            # Zustand stores
│   │   ├── auth.store.ts
│   │   ├── filters.store.ts
│   │   ├── ui.store.ts
│   │   └── notifications.store.ts
│   │
│   ├── types/                            # TypeScript types
│   │   ├── api.types.ts
│   │   ├── contrato.types.ts
│   │   ├── alerta.types.ts
│   │   ├── analisis.types.ts
│   │   ├── reporte.types.ts
│   │   ├── usuario.types.ts
│   │   ├── configuracion.types.ts
│   │   └── shared.types.ts
│   │
│   ├── utils/                            # Utilities
│   │   ├── formatters.ts                 # formatCurrency, formatDate
│   │   ├── validators.ts
│   │   ├── constants.ts                  # COLORS, ROLES
│   │   ├── helpers.ts
│   │   └── routes.ts                     # Route definitions
│   │
│   ├── styles/
│   │   ├── globals.css                   # Tailwind base
│   │   ├── variables.css                 # CSS variables
│   │   └── animations.css
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── logos/
│   │       └── gobia-logo.svg
│   │
│   └── lib/                              # Lib configurations
│       ├── react-query.ts                # Query client
│       └── i18n.ts                       # i18n (futuro)
│
├── public/
│   ├── index.html
│   ├── favicon.ico
│   ├── manifest.json
│   └── robots.txt
│
├── tests/
│   ├── unit/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   │
│   ├── integration/
│   │   ├── pages/
│   │   └── flows/
│   │
│   └── e2e/
│       ├── login.spec.ts
│       ├── dashboard.spec.ts
│       ├── contratos.spec.ts
│       ├── alertas.spec.ts
│       └── reportes.spec.ts
│
├── .env.example
├── .env.development
├── .env.production
│
├── .github/
│   └── workflows/
│       ├── lint.yml
│       ├── test.yml
│       ├── build.yml
│       └── deploy.yml
│
├── docker/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── nginx.conf
│
├── docs/
│   ├── COMPONENTS.md
│   ├── DESIGN_SYSTEM.md
│   └── DEPLOYMENT.md
│
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── components.json                       # shadcn config
├── playwright.config.ts
├── vitest.config.ts
├── .gitignore
├── .eslintrc.json
├── .prettierrc
└── README.md
```

---

## 🖼️ ANÁLISIS DE LOS 6 WIREFRAMES

### **🏠 Image 6: Dashboard - "Monitoreo de Riesgo Contractual"**

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ [GobIA Auditor]                              [SECOP] [User] │
├──────┬──────────────────────────────────────────┬───────────┤
│      │  Monitoreo de Riesgo Contractual         │           │
│ Dash │                                          │ Detalle   │
│ Cont │  ┌─────────────────────────────┐        │ del       │
│ Anál │  │ KPI │ KPI │ KPI │ KPI       │        │ análisis  │
│ Aler │  └─────────────────────────────┘        │           │
│ Rep  │                                          │ Score: 82 │
│ Conf │  ┌─────────────────────────────┐        │ Riesgo:   │
│      │  │ Filtros: Departamento, etc. │        │ Alto      │
│      │  └─────────────────────────────┘        │           │
│      │                                          │ Señales   │
│      │  ┌─────────────────────────────┐        │ detectadas│
│      │  │  Contratos priorizados      │        │           │
│      │  │  Tabla con score, riesgo,   │        │ [Ver SECOP│
│      │  │  entidad, modalidad...      │        │           │
│      │  └─────────────────────────────┘        │ Distrib.  │
│      │                                          │ donut     │
└──────┴──────────────────────────────────────────┴───────────┘
```

**Componentes clave:**
- 4 KPICards: "Contratos analizados (1.248)", "Riesgo alto (86)", "Riesgo medio (241)", "Entidades monitoreadas (132)"
- FilterBar: Departamento, Entidad, Modalidad, Rango de valor
- PrioritizedTable: 5 contratos con Score, Riesgo, Entidad, Procedimiento, Modalidad, Precio base, Señales, Acción
- DetailSidebar: ScoreCircle (82/100), Señales detectadas, Resumen IA, Distribución donut

---

### **📋 Image 5: Contratos - "Lista y búsqueda"**

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  Contratos                                                  │
│                                                             │
│  ┌────────────────────────────────────┐                    │
│  │  🔍 Buscar por entidad, proceso... │                    │
│  └────────────────────────────────────┘                    │
│                                                             │
│  Departamento | Modalidad | Estado | Riesgo | Fecha [Buscar│
│                                                             │
│  ┌─────────────────────────────────────────┐               │
│  │ KPIs: Total, Adjudicados, Análisis, Alto│               │
│  └─────────────────────────────────────────┘               │
│                                                             │
│  Tabs: [Todos] [Riesgo alto] [Con alertas] [Adjudicados]   │
│                                                             │
│  ┌─────────────────────────────────────────┐  ┌──────────┐│
│  │ ID │ Entidad │ Proced │ Modalidad │...  │  │ Detalle  ││
│  │ ── │ ─────── │ ────── │ ──────── │     │  │   del    ││
│  │ Tabla con 7+ contratos paginada         │  │ contrato ││
│  └─────────────────────────────────────────┘  └──────────┘│
└─────────────────────────────────────────────────────────────┘
```

**Componentes clave:**
- SearchBox global (búsqueda textual)
- FilterBar: 5 filtros (Departamento, Modalidad, Estado, Riesgo, Fecha publicación)
- 4 KPICards: Total contratos (248), Adjudicados (156), En análisis (47), Riesgo alto (36)
- Tabs: Todos, Riesgo alto, Con alertas, Adjudicados
- DataTable con columnas: ID Proceso, Entidad, Procedimiento, Modalidad, Estado, Valor, Riesgo, Fecha, Acciones
- ContractDetailPanel (sidebar): Toda la info del contrato + ScoreCircle + Señales + Botones

---

### **🤖 Image 4: Análisis IA - "Explicabilidad"**

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  Análisis IA                                                │
│                                                             │
│  Contrato seleccionado | Modo análisis | Modelo | [Ejecutar│
│                                                             │
│  Entradas analizadas: [Descripción] [Justificación] [...]   │
│                                                             │
│  ┌─────┬─────┬─────┬─────┐                                 │
│  │Score│Señal│Hall.│Conf.│                  ┌────────────┐│
│  │ 82  │  4  │  7  │ 91% │                  │ Resultado  ││
│  └─────┴─────┴─────┴─────┘                  │   82       ││
│                                              │  Riesgo    ││
│  Tabs: Resumen | Hallazgos | Evidencia | Rec│  Alto      ││
│                                              │            ││
│  ┌──────────────────────────────────┐       │ Señales    ││
│  │ Resumen ejecutivo (texto)        │       │ detectadas ││
│  │ Factores ponderados (5 barras)   │       │            ││
│  │ Trazabilidad del análisis (4)    │       │ Explicación││
│  │ Hallazgos principales (4 cards)  │       │   IA       ││
│  │ Evidencia textual destacada      │       │            ││
│  │ Recomendaciones                  │       │ [Ver SECOP]││
│  └──────────────────────────────────┘       │ [Descargar]││
│                                              └────────────┘│
└─────────────────────────────────────────────────────────────┘
```

**Componentes clave:**
- AnalysisHeader: Selector de contrato, modo, modelo, botón Ejecutar
- AnalysisInputs: Chips de entradas activas
- 4 ScoreCards: Score total, Señales críticas, Hallazgos IA, Confianza
- AnalysisTabs: Resumen, Hallazgos, Evidencia textual, Recomendaciones
- ExecutiveSummary: Texto del resumen
- WeightedFactors: 5 barras de factores ponderados con colores
- AnalysisTraceability: 4 pasos numerados con descripción
- KeyFindings: 4 cards con hallazgos
- TextualEvidence: Citas con campo origen
- Recommendations: Lista numerada
- ResultSidebar: ScoreCircle (82), señales, explicación IA, botones

---

### **🚨 Image 3: Alertas - "Gestión operativa"**

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  Alertas                                                    │
│                                                             │
│  🔍 Buscar por entidad, proceso, proveedor o tipo...        │
│                                                             │
│  Severidad | Estado | Tipo | Departamento | Fecha [Aplicar]│
│                                                             │
│  ┌────┬────┬────┬────┐                                     │
│  │ 12 │  4 │  5 │ 23 │                                     │
│  │Acti│Crit│Seg.│Resu│                       ┌─────────────│
│  └────┴────┴────┴────┘                       │ Detalle     ││
│                                              │ alerta      ││
│  Tabs: Todas | Críticas | Seguim | Resueltas │             ││
│                                              │ Score: 89   ││
│  ┌─────────────────────────────────────┐    │ Prioridad   ││
│  │ Sev│Tipo│Entidad│Proceso│...│Estado│    │ Alta        ││
│  │ ── │── │ ──── │ ──── │── │ ──── │    │             ││
│  │ Tabla 6+ alertas paginadas         │    │ Señales     ││
│  └─────────────────────────────────────┘    │ asociadas   ││
│                                              │             ││
│                                              │ Acciones    ││
│                                              │ sugeridas   ││
│                                              │             ││
│                                              │ [Analizar]  ││
│                                              │ [Ver SECOP] ││
│                                              │ [Marcar]    ││
│                                              │             ││
│                                              │ Distribuc.  ││
│                                              │ donut       ││
│                                              └─────────────│
└─────────────────────────────────────────────────────────────┘
```

**Componentes clave:**
- SearchBox + 5 filtros (Severidad, Estado, Tipo, Departamento, Fecha)
- 4 KPICards: Activas (12), Críticas (4), En seguimiento (5), Resueltas (23)
- Tabs: Todas, Críticas, En seguimiento, Resueltas
- AlertsTable: Severidad (badges), Tipo, Entidad, Proceso, Señal, Fecha, Estado, Acciones
- AlertDetailSidebar: ScoreCircle (89), Prioridad, Descripción, Señales asociadas, Acciones sugeridas, 3 botones (Analizar IA, Ver SECOP, Marcar revisada), Distribución donut

---

### **📊 Image 2: Reportes - "Informes ejecutivos"**

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  Reportes                                                   │
│                                                             │
│  Tipo | Período | Departamento | Formato [Programar][Generar│
│                                                             │
│  Cobertura: [Contratos][Alertas][Análisis IA][Entidades]    │
│                                                             │
│  ┌────┬────┬────┬────┐                                     │
│  │ 128│  14│ 356│  61│                                     │
│  │Gene│Prog│Desc│/100│                       ┌─────────────│
│  └────┴────┴────┴────┘                       │ Detalle del ││
│                                              │ reporte     ││
│  Tabs: Resumen | Contratación | Alertas | IA│             ││
│                                              │ Tipo: Ejec. ││
│  ┌──────────────────────────────────┐       │ Formato: PDF││
│  │ Resumen del período (texto)      │       │ Contratos:  ││
│  │ Indicadores clave (5 barras)     │       │   248       ││
│  │ Distribución riesgo (donut)      │       │             ││
│  │ Hallazgos priorizados (lista)    │       │ Score: 61   ││
│  │ Alertas por entidad (barras)     │       │ Riesgo medio││
│  │ Evolución del riesgo (línea)     │       │             ││
│  │ 4 cards: Concentración, etc.     │       │ Conclusión  ││
│  └──────────────────────────────────┘       │             ││
│                                              │ [Descargar] ││
│                                              │ [Compartir] ││
│                                              │ [Historial] ││
│                                              │             ││
│                                              │ Historial   ││
│                                              │ exportación ││
│                                              └─────────────│
└─────────────────────────────────────────────────────────────┘
```

**Componentes clave:**
- ReportConfig: 4 selectores + 2 botones
- ReportCoverage: 5 chips
- 4 KPICards: Reportes generados (128), Programados (14), Descargas (356), Riesgo promedio (61/100)
- ReportTabs: Resumen ejecutivo, Contratación, Alertas, IA, Histórico
- ExecutiveSummary: Texto
- KeyIndicators: 5 barras horizontales con porcentajes
- RiskDistributionChart: Donut con totales
- PrioritizedFindings: Lista numerada
- AlertsByEntity: Barras horizontales por entidad
- RiskEvolutionChart: Gráfico de líneas (6 semanas)
- 4 InsightCards: Mayor concentración, Modalidad dominante, Patrón textual, Acción sugerida
- ReportSidebar: Detalle, ScoreCircle, Conclusión, Botones, Historial de exportación

---

### **⚙️ Image 1: Configuración - "Administración"**

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  Configuración                                              │
│                                                             │
│  Tabs: General | Motor riesgo | IA | Alertas | Usuarios... │
│                              [Restaurar valores][Guardar]   │
│                                                             │
│  ┌────┬────┬────┬────┐                                     │
│  │ 24 │ 12 │  6 │ Op │                                     │
│  │Para│Regl│Auto│erat│                       ┌─────────────│
│  └────┴────┴────┴────┘                       │ Resumen de  ││
│                                              │ configurac. ││
│  ┌──────────────────────────────────┐       │             ││
│  │ 1. Configuración general         │       │ Sistema     ││
│  │   Nombre, ambiente, idioma...    │       │ listo: 92/  ││
│  └──────────────────────────────────┘       │   100       ││
│  ┌──────────────────────────────────┐       │             ││
│  │ 2. Datos e integraciones         │       │ Integración ││
│  │   SECOP II, frecuencia...        │       │ SECOP: ON   ││
│  └──────────────────────────────────┘       │ Modelo IA:  ││
│  ┌──────────────────────────────────┐       │   Activo    ││
│  │ 3. Motor de riesgo               │       │ Reglas: 12  ││
│  │   Sliders de pesos...            │       │ Alertas: 12 ││
│  └──────────────────────────────────┘       │ Usuarios: 3 ││
│  ... (9 secciones en total)                 │             ││
│                                              │ Cambios     ││
│                                              │ recientes   ││
│                                              │             ││
│                                              │ [Guardar]   ││
│                                              │ [Exportar]  ││
│                                              │ [Historial] ││
│                                              └─────────────│
└─────────────────────────────────────────────────────────────┘
```

**Componentes clave:**
- ConfigTabs: 6 tabs (General, Motor de riesgo, IA y análisis, Alertas, Usuarios y roles, Reportes)
- 4 SystemStatusCards: Parámetros activos (24), Reglas de riesgo (12), Automatizaciones (6), Estado (Operativo)
- 9 secciones colapsables:
  1. Configuración general (4 dropdowns + 2 toggles)
  2. Datos e integraciones (selectors + estado)
  3. Motor de riesgo (5 sliders + umbrales)
  4. IA y análisis (selectores + toggles + chips)
  5. Alertas y notificaciones (toggles + email)
  6. Usuarios y permisos (tabla)
  7. Respaldo y recuperación
  8. Historial de cambios
  9. Seguridad
- ConfigSummary (sidebar): Score (92/100), estado de cada componente, cambios recientes, 3 botones

---

## 🎨 SISTEMA DE DISEÑO

### **Paleta de Colores**

```css
/* tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      colors: {
        // Primarios (azul GobIA)
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          900: '#1E3A8A'
        },
        
        // Riesgos
        risk: {
          critical: '#DC2626',  // Rojo intenso
          high: '#EF4444',      // Rojo
          medium: '#F59E0B',    // Naranja
          low: '#10B981',       // Verde
        },
        
        // Severidades
        severity: {
          critical: '#DC2626',
          high: '#F97316',
          medium: '#FBBF24',
          low: '#84CC16',
        },
        
        // Estados
        status: {
          new: '#EF4444',       // Rojo (Nueva)
          review: '#F59E0B',    // Naranja (En revisión)
          tracking: '#FBBF24',  // Amarillo (En seguimiento)
          resolved: '#10B981',  // Verde (Resuelta)
          published: '#3B82F6', // Azul (Publicado)
          awarded: '#10B981',   // Verde (Adjudicado)
        },
        
        // Background
        bg: {
          primary: '#FFFFFF',
          secondary: '#F8FAFC',
          tertiary: '#F1F5F9',
        },
        
        // Text
        text: {
          primary: '#0F172A',
          secondary: '#475569',
          tertiary: '#94A3B8',
        },
        
        // Borders
        border: {
          DEFAULT: '#E2E8F0',
          light: '#F1F5F9',
          dark: '#CBD5E1',
        }
      }
    }
  }
}
```

### **Tipografía**

```css
/* globals.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

body {
  font-family: var(--font-sans);
}

/* Sizes */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
```

### **Spacing**

```css
/* Sistema de espaciado consistente */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
```

### **Shadows**

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

### **Border Radius**

```css
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-full: 9999px;  /* Circles */
```

---

## 🧩 COMPONENTES REUTILIZABLES

### **1. KPICard**

**Uso**: Dashboard, Contratos, Alertas, Reportes

```tsx
// components/common/KPICard.tsx
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number | string;
  trend?: number;
  trendLabel?: string;
  icon?: LucideIcon;
  iconColor?: string;
  variant?: 'default' | 'critical' | 'warning' | 'success';
}

export function KPICard({ 
  title, value, trend, trendLabel, icon: Icon, 
  iconColor = 'text-primary-500', variant = 'default' 
}: KPICardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-border">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-text-secondary mb-1">{title}</p>
          <p className="text-3xl font-bold text-text-primary">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${iconColor} bg-opacity-10`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        )}
      </div>
      
      {trend !== undefined && (
        <div className="flex items-center gap-1">
          {trend > 0 ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-sm font-medium ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          {trendLabel && (
            <span className="text-sm text-text-tertiary ml-1">
              {trendLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
```

### **2. ScoreCircle**

**Uso**: Análisis IA, Detalle de alertas, Detalle de contratos

```tsx
// components/common/ScoreCircle.tsx
interface ScoreCircleProps {
  score: number;       // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  riskCategory?: 'CRÍTICO' | 'ALTO' | 'MEDIO' | 'BAJO';
}

export function ScoreCircle({ score, size = 'md', showLabel = true, riskCategory }: ScoreCircleProps) {
  const colors = {
    'CRÍTICO': 'stroke-red-700',
    'ALTO': 'stroke-red-500',
    'MEDIO': 'stroke-orange-500',
    'BAJO': 'stroke-green-500'
  };
  
  const category = riskCategory || (
    score >= 85 ? 'CRÍTICO' :
    score >= 70 ? 'ALTO' :
    score >= 40 ? 'MEDIO' : 'BAJO'
  );
  
  const sizeClasses = {
    sm: { container: 'w-16 h-16', text: 'text-lg' },
    md: { container: 'w-24 h-24', text: 'text-2xl' },
    lg: { container: 'w-32 h-32', text: 'text-3xl' }
  };
  
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative ${sizeClasses[size].container}`}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50" cy="50" r={radius}
            className="stroke-gray-200 fill-none"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50" cy="50" r={radius}
            className={`fill-none ${colors[category]} transition-all duration-700`}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${sizeClasses[size].text}`}>
            {score}
          </span>
          <span className="text-xs text-text-tertiary">/100</span>
        </div>
      </div>
      {showLabel && (
        <span className={`text-sm font-medium ${
          category === 'CRÍTICO' ? 'text-red-700' :
          category === 'ALTO' ? 'text-red-500' :
          category === 'MEDIO' ? 'text-orange-500' :
          'text-green-500'
        }`}>
          Riesgo {category}
        </span>
      )}
    </div>
  );
}
```

### **3. RiskBadge**

```tsx
// components/common/RiskBadge.tsx
interface RiskBadgeProps {
  level: 'CRÍTICO' | 'ALTO' | 'MEDIO' | 'BAJO';
  size?: 'sm' | 'md';
}

export function RiskBadge({ level, size = 'md' }: RiskBadgeProps) {
  const styles = {
    'CRÍTICO': 'bg-red-100 text-red-700 border-red-200',
    'ALTO': 'bg-red-50 text-red-600 border-red-100',
    'MEDIO': 'bg-orange-50 text-orange-600 border-orange-100',
    'BAJO': 'bg-green-50 text-green-600 border-green-100'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  };
  
  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${styles[level]} ${sizeClasses[size]}`}>
      {level}
    </span>
  );
}
```

### **4. DataTable** (con paginación y filtros)

```tsx
// components/common/DataTable/DataTable.tsx
interface Column<T> {
  key: string;
  header: string;
  accessor: (item: T) => any;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  selectedItem?: T | null;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

export function DataTable<T>({ columns, data, isLoading, onRowClick, selectedItem, pagination }: DataTableProps<T>) {
  if (isLoading) return <LoadingSpinner />;
  if (data.length === 0) return <EmptyState />;
  
  return (
    <div className="bg-white rounded-lg shadow border border-border">
      <table className="w-full">
        <thead className="bg-bg-secondary border-b border-border">
          <tr>
            {columns.map(col => (
              <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((item, idx) => (
            <tr 
              key={idx}
              onClick={() => onRowClick?.(item)}
              className={`
                ${onRowClick ? 'cursor-pointer hover:bg-bg-secondary' : ''}
                ${selectedItem === item ? 'bg-primary-50' : ''}
                transition-colors
              `}
            >
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3 text-sm">
                  {col.render 
                    ? col.render(col.accessor(item), item)
                    : col.accessor(item)
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {pagination && (
        <Pagination 
          page={pagination.page}
          limit={pagination.limit}
          total={pagination.total}
          onChange={pagination.onPageChange}
        />
      )}
    </div>
  );
}
```

### **5. DonutChart** (Distribución de riesgo)

```tsx
// components/charts/DonutChart.tsx
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface DonutChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  total?: number;
  centerLabel?: string;
}

export function DonutChart({ data, total, centerLabel }: DonutChartProps) {
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      {total && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold">{total}</span>
          {centerLabel && (
            <span className="text-sm text-text-secondary">{centerLabel}</span>
          )}
        </div>
      )}
      
      <div className="mt-4 space-y-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.name}</span>
            </div>
            <span className="font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 📅 FASES DE DESARROLLO

### **FASE 1: Setup & Layout (Semana 1)**

**Sprint 1.1: Inicialización del proyecto (Días 1-2)**

```bash
# Crear proyecto
npm create vite@latest gobia-auditor-frontend -- --template react-ts
cd gobia-auditor-frontend

# Instalar dependencias core
npm install
npm install react-router-dom axios
npm install @tanstack/react-query zustand
npm install -D tailwindcss postcss autoprefixer
npm install -D @types/node

# Setup Tailwind
npx tailwindcss init -p

# Instalar shadcn/ui
npx shadcn-ui@latest init

# Instalar componentes base
npx shadcn-ui@latest add button input select card dialog tabs
```

**Tasks:**
- [ ] Vite + TypeScript configurado
- [ ] Tailwind CSS configurado
- [ ] shadcn/ui instalado
- [ ] React Router setup
- [ ] React Query configured
- [ ] Axios instance con interceptores
- [ ] ESLint + Prettier
- [ ] Git hooks (husky)

**Sprint 1.2: Layout y Navegación (Días 3-4)**

**Tasks:**
- [ ] AppLayout component
- [ ] Sidebar (con menu de 6 items + activo)
- [ ] Header (con logo, datos públicos SECOP, usuario)
- [ ] DataSourceFooter (info sobre datos)
- [ ] Routing structure
- [ ] ProtectedRoute HOC

**Componentes a crear:**
```
components/layout/AppLayout.tsx
components/layout/Sidebar.tsx     # Menú lateral fijo
components/layout/Header.tsx       # Top bar con SECOP status
components/layout/DataSourceFooter.tsx
components/auth/ProtectedRoute.tsx
```

**Sprint 1.3: Página de Login (Días 4-5)**

**Tasks:**
- [ ] LoginPage
- [ ] LoginForm con validación
- [ ] Auth service
- [ ] Auth store (Zustand)
- [ ] JWT manager
- [ ] Persistencia de sesión

**Sprint 1.4: Sistema de Diseño Base (Días 5-7)**

**Tasks:**
- [ ] Tailwind config con paleta completa
- [ ] CSS variables
- [ ] Componentes base de shadcn:
  - Button (variants: primary, secondary, danger, ghost)
  - Input
  - Select  
  - Badge
  - Card
  - Dialog
  - Tabs
- [ ] Componentes custom:
  - KPICard
  - ScoreCircle
  - RiskBadge
  - SeverityBadge
  - StatusBadge
  - SearchBox

**Deliverable Semana 1:**
```
✅ Proyecto inicializado
✅ Layout responsive funcional
✅ Login funcionando con backend
✅ Componentes base creados
✅ Sistema de diseño establecido
```

---

### **FASE 2: Dashboard + Contratos (Semana 2)**

**Sprint 2.1: Dashboard (Días 8-10)**

**Tasks:**
- [ ] DashboardPage
- [ ] KPICards (4 cards superiores)
- [ ] FiltersPanel (Departamento, Entidad, Modalidad, Rango)
- [ ] PrioritizedTable
- [ ] DetailSidebar
- [ ] DonutChart de distribución
- [ ] Conexión con API

**Sprint 2.2: Contratos - Listado (Días 10-12)**

**Tasks:**
- [ ] ContratosPage
- [ ] SearchBox global
- [ ] FilterBar (5 filtros)
- [ ] KPICards (4 cards)
- [ ] Tabs (Todos, Riesgo alto, Con alertas, Adjudicados)
- [ ] DataTable con paginación
- [ ] ContractDetailPanel (sidebar)
- [ ] Conexión con API

**Sprint 2.3: Contratos - Detalle y acciones (Días 12-14)**

**Tasks:**
- [ ] ContratoDetailPage (vista completa)
- [ ] Botón "Analizar con IA"
- [ ] Botón "Ver en SECOP"
- [ ] Botón "Descargar ficha" (PDF)
- [ ] Tests de integración

**Deliverable Semana 2:**
```
✅ Dashboard funcional con KPIs y tabla
✅ Lista de contratos con filtros
✅ Detalle de contrato
✅ Búsqueda y paginación
```

---

### **FASE 3: Análisis IA (Semana 3)**

**Sprint 3.1: Página de Análisis (Días 15-17)**

**Tasks:**
- [ ] AnalisisIAPage layout
- [ ] AnalysisHeader (selector + botón ejecutar)
- [ ] AnalysisInputs (chips)
- [ ] 4 ScoreCards
- [ ] AnalysisTabs

**Sprint 3.2: Componentes de análisis (Días 17-19)**

**Tasks:**
- [ ] ExecutiveSummary
- [ ] WeightedFactors (5 barras de progreso con colores)
- [ ] AnalysisTraceability (4 pasos numerados)
- [ ] KeyFindings (4 cards con íconos)
- [ ] TextualEvidence (citas)
- [ ] Recommendations (lista numerada)

**Sprint 3.3: Sidebar y export (Días 19-21)**

**Tasks:**
- [ ] ResultSidebar con ScoreCircle
- [ ] Señales detectadas
- [ ] Explicación IA
- [ ] Botón "Ver proceso en SECOP"
- [ ] Botón "Descargar informe" (PDF)

**Deliverable Semana 3:**
```
✅ Página de análisis IA completa
✅ Todos los componentes de análisis
✅ Export a PDF funcional
✅ Sidebar interactivo
```

---

### **FASE 4: Alertas + Reportes (Semana 4)**

**Sprint 4.1: Alertas (Días 22-24)**

**Tasks:**
- [ ] AlertasPage
- [ ] SearchAndFilters
- [ ] AlertsKPICards (4 cards)
- [ ] AlertsTabs (4 tabs)
- [ ] AlertsTable con badges de severidad
- [ ] AlertDetailSidebar
- [ ] AlertActions (3 botones)
- [ ] Distribución donut

**Sprint 4.2: Reportes - Configuración y KPIs (Días 24-26)**

**Tasks:**
- [ ] ReportesPage
- [ ] ReportConfig (4 selectores)
- [ ] ReportCoverage (chips)
- [ ] ReportKPICards (4 cards)
- [ ] ReportTabs

**Sprint 4.3: Reportes - Visualizaciones (Días 26-28)**

**Tasks:**
- [ ] ExecutiveSummary
- [ ] KeyIndicators (5 barras horizontales)
- [ ] RiskDistributionChart (donut)
- [ ] PrioritizedFindings (lista)
- [ ] AlertsByEntity (barras horizontales)
- [ ] RiskEvolutionChart (líneas)
- [ ] InsightCards (4 cards)
- [ ] ReportSidebar con detalle e historial

**Deliverable Semana 4:**
```
✅ Sistema de alertas completo
✅ Generación de reportes
✅ Todos los gráficos funcionales
✅ Export PDF/XLSX
```

---

### **FASE 5: Configuración (Semana 5)**

**Sprint 5.1: Tabs y secciones (Días 29-31)**

**Tasks:**
- [ ] ConfiguracionPage
- [ ] ConfigTabs (6 tabs)
- [ ] SystemStatusCards (4 cards)
- [ ] GeneralSection (4 dropdowns + 2 toggles)
- [ ] DataIntegrationSection
- [ ] RiskEngineSection (5 sliders)

**Sprint 5.2: Secciones avanzadas (Días 31-33)**

**Tasks:**
- [ ] AISection (selectores + chips de entradas)
- [ ] AlertsSection (toggles + email)
- [ ] UsersSection (tabla con acciones)
- [ ] BackupSection
- [ ] HistorySection
- [ ] SecuritySection

**Sprint 5.3: Sidebar y acciones (Días 33-35)**

**Tasks:**
- [ ] ConfigSummary (sidebar)
- [ ] Botones (Guardar, Exportar, Historial)
- [ ] Probar conexión SECOP
- [ ] Realizar respaldo
- [ ] Verificación de seguridad
- [ ] Restaurar valores

**Deliverable Semana 5:**
```
✅ 9 secciones de configuración
✅ Sliders y toggles funcionales
✅ Gestión de usuarios
✅ Acciones administrativas
```

---

### **FASE 6: Testing y Polish (Semana 6)**

**Sprint 6.1: Testing comprehensivo (Días 36-38)**

**Tasks:**
- [ ] Unit tests para components clave (Vitest)
- [ ] Integration tests para páginas
- [ ] E2E tests para flujos críticos (Playwright):
  - Login → Dashboard
  - Buscar contrato → Análisis IA
  - Generar reporte → Descargar
  - Marcar alerta como revisada
- [ ] Coverage > 80%

**Sprint 6.2: Optimización (Días 38-40)**

**Tasks:**
- [ ] Lazy loading de páginas
- [ ] Code splitting
- [ ] Image optimization
- [ ] Bundle analysis
- [ ] Performance testing
- [ ] Accessibility (a11y)
- [ ] Lighthouse score > 90

**Sprint 6.3: Deployment (Días 40-42)**

**Tasks:**
- [ ] Dockerfile producción
- [ ] Nginx config
- [ ] CI/CD GitHub Actions
- [ ] Environment variables
- [ ] Documentación final
- [ ] README completo

**Deliverable Semana 6:**
```
✅ Tests completos
✅ Performance optimizado
✅ Production-ready
✅ CI/CD funcionando
✅ Documentación completa
```

---

## 🧪 TESTING

### **Unit Tests (Vitest)**

```typescript
// tests/unit/components/KPICard.test.tsx
import { render, screen } from '@testing-library/react';
import { KPICard } from '@/components/common/KPICard';

describe('KPICard', () => {
  it('renders title and value', () => {
    render(<KPICard title="Contratos" value={99353} />);
    
    expect(screen.getByText('Contratos')).toBeInTheDocument();
    expect(screen.getByText('99,353')).toBeInTheDocument();
  });
  
  it('shows positive trend with TrendingUp icon', () => {
    render(<KPICard title="Riesgo" value={2180} trend={2.2} />);
    
    expect(screen.getByText('+2.2%')).toBeInTheDocument();
  });
});
```

### **Integration Tests (RTL + MSW)**

```typescript
// tests/integration/pages/Dashboard.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { DashboardPage } from '@/pages/DashboardPage';
import { server } from '@/mocks/server';

describe('Dashboard Page', () => {
  it('loads and displays KPIs from API', async () => {
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('99,353')).toBeInTheDocument();
      expect(screen.getByText('Contratos analizados')).toBeInTheDocument();
    });
  });
  
  it('filters contracts when department changes', async () => {
    const { user } = render(<DashboardPage />);
    
    await user.selectOptions(
      screen.getByLabelText('Departamento'),
      'Cundinamarca'
    );
    
    await waitFor(() => {
      expect(screen.getByText(/Cundinamarca/)).toBeInTheDocument();
    });
  });
});
```

### **E2E Tests (Playwright)**

```typescript
// tests/e2e/dashboard-flow.spec.ts
import { test, expect } from '@playwright/test';

test('Complete dashboard flow', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('input[name="email"]', 'admin@test.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');
  
  // Verify dashboard loads
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('text=Monitoreo de Riesgo')).toBeVisible();
  
  // Apply filter
  await page.selectOption('select[name="departamento"]', 'Cundinamarca');
  await page.click('button:has-text("Analizar")');
  
  // Click on a contract
  await page.click('table tr:nth-child(2)');
  
  // Verify detail sidebar
  await expect(page.locator('[data-testid="detail-sidebar"]')).toBeVisible();
  
  // Click "Ver detalle"
  await page.click('button:has-text("Ver detalle")');
  
  // Verify navigation
  await expect(page).toHaveURL(/\/contratos\/\d+/);
});
```

---

## 🚀 DEPLOYMENT

### **Vite Build Configuration**

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'charts': ['recharts'],
          'ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        }
      }
    },
    
    chunkSizeWarningLimit: 1000
  },
  
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
});
```

### **Dockerfile Producción**

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### **Nginx Config**

```nginx
# docker/nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;
    
    # Gzip
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy
    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### **CI/CD GitHub Actions**

```yaml
# .github/workflows/deploy.yml
name: Deploy Frontend

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run test:unit
      - run: npm run build
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: docker build -t gobia-frontend:latest .
      
      - name: Push to registry
        run: |
          echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker tag gobia-frontend:latest ${{ secrets.DOCKER_USERNAME }}/gobia-frontend:latest
          docker push ${{ secrets.DOCKER_USERNAME }}/gobia-frontend:latest
      
      - name: Deploy to server
        run: |
          # Deploy script here
```

---

## 📋 CHECKLIST FINAL

### **Pre-desarrollo**
- [ ] Repo creado con estructura
- [ ] Backend API en staging
- [ ] Wireframes aprobados
- [ ] Design tokens definidos
- [ ] Team onboarding

### **Durante desarrollo**
- [ ] Code reviews en cada PR
- [ ] Tests passing antes de merge
- [ ] Linting + type checking
- [ ] Storybook (opcional) para componentes
- [ ] Performance monitoring

### **Pre-producción**
- [ ] Tests > 80% coverage
- [ ] Lighthouse score > 90
- [ ] Accessibility (a11y) check
- [ ] Cross-browser testing
- [ ] Mobile responsive verificado
- [ ] Performance audit
- [ ] Security audit

### **Documentación**
- [ ] README con setup
- [ ] Component library docs
- [ ] Architecture decisions
- [ ] Deployment guide
- [ ] Style guide

---

## 🎯 ESTIMACIÓN FINAL

| Recurso | Cantidad | Tiempo |
|---|---|---|
| Frontend Devs | 1-2 | 5-6 semanas |
| UX/UI Designer | 1 | 2-3 semanas (parallel) |
| QA | 1 | 2 semanas (último mes) |
| DevOps | 0.5 | 1 semana |
| **TOTAL** | **3-4 personas** | **6 semanas** |

### **Esfuerzo por Fase**

| Fase | Descripción | Horas |
|---|---|---|
| 1 | Setup + Layout | 40 |
| 2 | Dashboard + Contratos | 60 |
| 3 | Análisis IA | 40 |
| 4 | Alertas + Reportes | 60 |
| 5 | Configuración | 40 |
| 6 | Testing + Polish | 40 |
| **TOTAL** | | **280 horas** |

---

## 📚 RECURSOS

### **Documentación**

- [React 18 docs](https://react.dev)
- [TanStack Query](https://tanstack.com/query/latest)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Recharts](https://recharts.org)

### **Inspiration**

- [Vercel Dashboard](https://vercel.com)
- [Linear](https://linear.app)
- [Stripe Dashboard](https://stripe.com)

---

**Status**: ✅ LISTO PARA INICIAR  
**Próximo paso**: Crear repo y empezar Sprint 1.1

¿Preguntas o ajustes al plan? 🚀
