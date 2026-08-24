# GobIA Auditor — Arquitectura y heurísticas de análisis

> Documento generado a partir de una auditoría directa del código (frontend, backend y los scripts de scoring), no de documentación previa. Donde algo no se pudo verificar en el código, se indica explícitamente en vez de asumirlo.

---

## 1. Arquitectura del Frontend

### 1.0 Patrón arquitectónico

**Es una arquitectura en capas (layered) con una capa de servicios delgada — no es Clean Architecture ni Feature-Sliced Design formal.**

```
Página (index.tsx)  →  Hook (useX.ts, TanStack Query)  →  Service (x.service.ts, axios + mapeo)  →  API
        ↑                                                          ↓
   Zustand (filtros UI)                                   types/x.types.ts (tipos de dominio del front)
```

- **Sí hay separación de capas real**: ninguna página llama a `axios`/`api.ts` directamente ni a un `*.service.ts` directamente — siempre pasa por un hook de TanStack Query. Eso es, en términos estrictos, un **Service Layer pattern** (Fowler) aplicado del lado del cliente: el service es la única puerta hacia el backend, y el hook es la capa de adaptación a React (cache, invalidación, estados de carga).
- **No es Clean Architecture**: no hay una capa de "casos de uso"/interactors independiente del framework, no hay entidades de dominio con lógica propia (los `types/*.types.ts` son interfaces planas, no clases con comportamiento), y los componentes de página conocen directamente los hooks concretos (no hay inversión de dependencias vía interfaces/puertos).
- **No es MVC ni MVVM formal**: no hay controladores ni view-models explícitos; el propio componente de página cumple ese rol (orquesta estado + arma el JSX).
- **Organización por feature/página, no por tipo de artefacto a nivel raíz**: cada página tiene su propia carpeta con `index.tsx` + `components/` locales (patrón cercano a *feature folders*, pero sin la disciplina de *Feature-Sliced Design* — no hay capas `entities/features/widgets` explícitas, y `services/`, `hooks/` y `types/` sí están centralizados por tipo a nivel global, no duplicados por feature).
- **Estado dividido con criterio correcto**: estado de servidor (datos remotos) vive en TanStack Query; estado de UI/filtros vive en Zustand. Es la separación estándar recomendada en el ecosistema React actual, no una mezcla ad hoc.

En una frase: **"layered architecture con capa de servicios y estado de servidor separado del estado de UI"**, organizada por página. Es un patrón pragmático y común en apps React de tamaño medio — no es incorrecto, simplemente no es "Clean Architecture" (que es un término más específico que este proyecto no implementa).

**Stack:** React 19 + TypeScript + Vite 8

| Capa | Tecnología | Uso |
|---|---|---|
| Build / dev server | Vite 8 | `npm run dev` (puerto 3000), proxy al backend |
| UI | React 19 + Tailwind CSS 4 | Componentes funcionales, sin clases |
| Componentes headless | Radix UI (`@radix-ui/react-*`) | Dialog, Dropdown, Select, Switch, Tabs, Tooltip |
| Estado de servidor | TanStack Query v5 | Cache/fetch de datos del backend (`useQuery`/`useMutation`) |
| Estado de cliente/UI | Zustand | Filtros persistentes por página (`useFiltersStore`) |
| Ruteo | React Router 7 | Rutas declaradas en `App.tsx` |
| HTTP | Axios | Cliente único en `services/api.ts`, con `paramsSerializer` custom (bug de arrays con FastAPI corregido ahí) |
| Formularios | React Hook Form + Zod | Validación tipada |
| Gráficas | Recharts | Donut, barras, líneas |
| Grafo de relaciones | Cytoscape.js (+ cose-bilkent, navigator) | Mapa de relaciones |
| Fechas | date-fns (locale `es`) | Formateo y tiempo relativo |
| Exportables | jsPDF | Exportar grafo a PDF/PNG |
| Iconos | Lucide React | — |

**Convención de carpetas:**

```
src/
  pages/<Página>/
    index.tsx              # orquestador: hooks + layout
    components/             # subcomponentes propios de la página (solo en páginas grandes)
  services/<recurso>.service.ts   # llamadas HTTP + mapeo snake_case (backend) -> camelCase (frontend)
  hooks/use<Recurso>.ts           # wrappers de useQuery/useMutation sobre el service
  types/<recurso>.types.ts        # tipos de dominio del frontend
  store/filters.store.ts          # estado de filtros por página (Zustand)
  components/common/              # KPICard, DataTable, ScoreCircle, RiskBadge, Toast, etc.
  components/layout/              # Sidebar, Header, AppLayout (compartidos en todas las páginas)
```

**Patrón backend↔frontend:** el backend devuelve JSON plano en `snake_case`, sin envolver en `{data: ...}`. Cada `*.service.ts` define un tipo `Backend*` local y una función `map*()` que lo convierte a los tipos camelCase del frontend. Las páginas nunca llaman servicios directamente, siempre pasan por un hook.

**Páginas (rutas):**

| Ruta | Página | Estado |
|---|---|---|
| `/dashboard` | Monitoreo general | Conectado a datos reales |
| `/contratos` | Listado y detalle de contratos | Conectado a datos reales |
| `/analisis/nuevo`, `/analisis/:id` | Consulta de análisis de riesgo ya calculado por contrato | Conectado a datos reales (no ejecuta análisis en vivo, es lookup) |
| `/alertas`, `/alertas/:id` | Contratos con score de riesgo alto | Conectado a datos reales |
| `/mapa-relaciones` | Grafo entidad → proveedor → persona → sanción | Conectado al endpoint real; hoy casi siempre muestra solo el nodo central porque `Contract.nit_proveedor` está vacío en toda la BD (ver §4) |
| `/reportes` | Generación y descarga de reportes PDF/Excel + analítica | Conectado a datos reales; programación de reportes y envío por email deshabilitados honestamente (no hay Redis/Celery corriendo ni SMTP configurado) |
| `/configuracion` | Configuración del sistema, motor de riesgo, usuarios | Front conectado a un backend real (`/configuracion`, `/usuarios`), aunque el motor de riesgo que ahí se "configura" no alimenta ningún scoring real (ver §4.4) |

---

## 2. Arquitectura del Backend

### 2.0 Patrón arquitectónico

**Es una arquitectura en 2 capas (API + ORM), estilo "Transaction Script" — no es Clean Architecture, no es Hexagonal/Ports & Adapters, y no hay capa de repositorio.**

Evidencia concreta: se contó cuántos archivos de endpoint llaman directamente a `db.query`/`db.add`/`db.commit` dentro del propio handler de la ruta, y es la inmensa mayoría:

| Archivo | Líneas con acceso directo a la BD dentro del endpoint |
|---|---|
| `contracts.py` | 9 |
| `alertas.py` | 9 |
| `reports.py` | 13 |
| `proveedores.py` | 11 |
| `dashboard.py` | 8 |
| `configuracion.py` | 8 |
| `relaciones.py` | 5 |
| `personas.py`, `buscar.py` | 4 c/u |
| `entities.py` | 1 |

```
Endpoint (FastAPI route)  →  SQLAlchemy Query directo (db.query(...))  →  Pydantic schema de respuesta
```

- **No hay capa de repositorio**: no existe ninguna clase `*Repository`, ninguna interfaz/`Protocol`/`ABC` en todo `app/`. El propio handler de FastAPI arma el `db.query(...)`, aplica filtros, y a veces incluso subconsultas correlacionadas (ver el `num_senales` que agregamos en `contracts.py`) — todo dentro de la función de la ruta.
- **No es Clean Architecture ni Hexagonal**: no hay capa de dominio independiente del framework, no hay "casos de uso" que orquesten reglas de negocio sin conocer FastAPI/SQLAlchemy, y no hay inversión de dependencias (los endpoints dependen directamente de SQLAlchemy vía `Depends(get_db)`, no de una interfaz abstracta de acceso a datos). Esto significa que la lógica de negocio y la lógica de acceso a datos están mezcladas en el mismo archivo/función — es exactamente lo que Clean Architecture busca evitar.
- **Es "Transaction Script"** (patrón de Fowler): cada endpoint es un script imperativo autocontenido — arma la query, aplica reglas ad hoc (ej. los umbrales de `score_final > 50` / `> 80` en `alertas.py`), y devuelve el schema. No hay objetos de dominio con comportamiento propio.
- **Hay una capa de servicios, pero parcial y con excepciones ya confirmadas como código muerto**: `app/services/reporting.py` sí es un service real y usado (genera PDF/Excel, invocado desde `reports.py`). Pero `app/services/riesgo.py` es un segundo "servicio" que **nunca se invoca desde ningún endpoint** — confirmado código muerto (ver §3.3). Es decir, la carpeta `services/` existe pero no es una capa consistente: unos endpoints la usan, la mayoría no.
- **Los `schemas/` sí cumplen un rol de capa real**: Pydantic separa el contrato de la API (lo que se serializa) de los modelos ORM (lo que se persiste) — esa es la única frontera de capas que se respeta de forma consistente en todo el backend.

En una frase: **"arquitectura de 2 capas — controladores FastAPI que hacen Transaction Script directo sobre SQLAlchemy, con Pydantic como única capa de frontera consistente"**. Es el patrón típico de un MVP/prototipo construido rápido: funcional y fácil de seguir archivo por archivo, pero sin las fronteras que darían testabilidad aislada de la lógica de negocio (no se puede probar una regla sin levantar una sesión de base de datos real, porque la regla y la query viven en la misma función).

**Stack:** FastAPI + SQLAlchemy 2.0 + Alembic + PostgreSQL, Pydantic v2

| Capa | Tecnología |
|---|---|
| Framework web | FastAPI (`uvicorn` como servidor ASGI) |
| ORM | SQLAlchemy 2.0 |
| Migraciones | Alembic (8 migraciones aplicadas: inicial + 7 incrementales) |
| Validación / schemas | Pydantic v2 |
| Base de datos | PostgreSQL (vía `psycopg2`) |
| Reportes | ReportLab (PDF), openpyxl (Excel), WeasyPrint (declarado, no confirmado en uso activo) |
| Cola de tareas | Celery + Redis — **declarados en `requirements.txt` pero sin ninguna tarea (`@celery_app.task`) registrada ni Redis corriendo**. No hay jobs en background reales hoy. |

**Estructura:**

```
app/
  main.py                 # app FastAPI, CORS, incluye api_router
  api/v1/api.py            # registro de todos los routers con su prefijo
  api/v1/endpoints/
    dashboard.py           # /dashboard/stats
    contracts.py           # /contracts (listado, detalle, resumen, filtros)
    reports.py              # /reportes (generar, descargar, stats, analítica)
    entities.py              # /entities (búsqueda de entidades — 3,334 reales)
    alertas.py               # /alertas (contratos de score alto, cambio de estado)
    proveedores.py, personas.py   # datos de proveedores/personas (tablas hoy vacías, ver §4.3)
    relaciones.py            # /relaciones/grafo — grafo de relaciones (Endpoint marcado "CRÍTICO" en su propio docstring)
    buscar.py                 # búsqueda transversal
    analisis.py                # /analisis/casos, /analisis/grafo-red — sirve outputs de Agente_Red (ver §4.2)
    configuracion.py            # /configuracion, /usuarios — panel de configuración
  models/
    contract.py             # Entity, Provider, Contract, ContractRaw, RiskAnalysis, DetectionFlag
    proveedor.py              # Proveedor, Persona, ProveedorPersona, PEPLista, Sancion, ConflictoInteres (tablas vacías hoy)
    report.py, system.py       # GeneratedReport, SystemConfig
  services/
    reporting.py               # generación de PDF/Excel
    riesgo.py                   # scorer de `Proveedor.nivel_riesgo` — código muerto, nunca se ejecuta (ver §4.3)
  schemas/                      # Pydantic: contract, dashboard, alerta, report, proveedor, configuracion
  tasks/celery_app.py            # Celery configurado pero sin tareas registradas
```

**Datos reales en producción (verificado en la BD):**
- 99,353 contratos (`contratos`)
- 3,334 entidades (`entidades`)
- 100% de los contratos tiene `RiskAnalysis` asociado (score_heuristico, score_llm, score_final, categoria_riesgo, evidencia)
- 44,569 filas en `flags_deteccion`, repartidas en solo **2** tipos de flag reales: `modalidad_sensible` (44,555) y `proveedor_nuevo` (14)
- `Contract.nit_proveedor` está **vacío en el 100% de los contratos** → no hay vínculo proveedor↔contrato, por eso el Mapa de Relaciones no puede mostrar proveedores/personas/sanciones hoy aunque el endpoint que los serviría existe y es correcto.
- Tablas `proveedores_detalle`, `personas`, `proveedor_personas`, `pep_lista`, `sanciones`, `conflictos_interes`: **0 filas**, todas.

---

## 3. Heurísticas para el análisis de contratos

Esta es la parte más importante de aclarar honestamente: **no existe hoy un único motor de heurísticas en el código**. Al auditar el repositorio completo (backend, migraciones, scripts, y el módulo `Agente_Red`), se encontraron **cuatro implementaciones de scoring distintas, parcialmente incompatibles entre sí, y solo una de ellas tiene su lógica de condición completa y legible**. Ninguna de las cuatro está confirmada como la que generó los valores que hoy están en la base de datos de producción.

### 3.1 Lo que sí sabemos con certeza (datos reales en la BD)

- Cada contrato tiene 3 scores guardados: `score_heuristico`, `score_llm`, `score_final` (0–100), más una `categoria_riesgo` (BAJO/MEDIO/ALTO/CRÍTICO) y un texto libre `evidencia`.
- El **script que calculó esos valores no existe en ningún repositorio ni carpeta accesible hoy**. El loader que sí existe (`scripts/load_contracts.py`) solo **lee un JSON ya calculado** (`contratos_enriquecidos.json`, 145 MB) y lo inserta tal cual en la BD — no calcula nada:

```python
risk = RiskAnalysis(
    score_heuristico=item.get('heuristic_score'),
    score_llm=item.get('llm_score'),
    score_final=item.get('final_score'),
    categoria_riesgo=item.get('risk_category'),
    evidencia=item.get('evidence')
)
```

- Por lo tanto, **la fórmula exacta que combina `score_heuristico` + `score_llm` → `score_final`, y los umbrales exactos que definen BAJO/MEDIO/ALTO/CRÍTICO en producción, no se pueden reconstruir desde el código actual.** Solo sobrevive el resultado, no el proceso.

### 3.2 `Agente_Red/` — el único motor con lógica de heurísticas legible (pero es otro sistema)

Este módulo es independiente, alimenta el "Mapa de relaciones" (no las tablas `analisis_riesgo`/`flags_deteccion` que usa el resto de la app), y nunca toca Postgres — trabaja sobre un parquet aparte y escribe a archivos locales.

**Pesos (`Agente_Red/config.py`):**

| Señal | Condición (código real) | Peso |
|---|---|---|
| Baja competencia | `alerta_baja_competencia` (booleano ya pre-calculado en el dataset de entrada) | 20 |
| Modalidad sensible | `alerta_modalidad_sensible` | 15 |
| Valor cercano al precio base | `alerta_valor_cercano_precio_base` | 10 |
| Sanción previa | `alerta_sancion_multa` | 20 |
| Coincidencia PEP | `alerta_representante_pep` | 25 |
| Conflicto de interés | `alerta_representante_conflicto` | 25 |
| Alta participación de un proveedor (≥30%) | `participacion >= 0.30` | 20 |
| Concentración HHI alta (≥0.25) | `hhi >= 0.25` | 10 |
| Proveedor recurrente (≥5 contratos con la misma entidad) | `contratos_proveedor >= 5` | 20 |
| Red de empresas con mismo representante (≥2) | `grupo_representante >= 2` | 15 |
| Consorcios relacionados | *(peso definido, sin condición implementada — no se dispara nunca)* | 15 |

Clasificación: score ≥ 60 → Alto · score ≥ 30 → Medio · < 30 → Bajo (score acumulado, máximo teórico ~175).

Importante: las señales booleanas de entrada (`alerta_baja_competencia`, `alerta_modalidad_sensible`, etc.) **ya vienen precalculadas en el dataset que este módulo consume** — el script que las calculó tampoco está en el repositorio.

**Componente de IA real:** `Agente_Red` sí integra un cliente tipo Anthropic (`agents/llm_client.py`) con dos agentes:
- `ExplicadorAgent`: genera narrativa/explicación en texto para "casos destacados" (no toca el score numérico).
- `InferenciaProfundaAgent`: busca patrones cruzados (recurrencia anómala, concentración progresiva, triangulación), opcional vía flag `--profundo`.

Ambos están **confirmados en modo mock**: no hay API key configurada, y el output guardado (`casos_destacados.json`) tiene `"_es_mock": true` con todos los campos narrativos vacíos. Es decir, el componente de IA generativa está construido pero nunca se ejecutó de verdad — todo lo que hay hoy es puramente heurístico/determinístico.

### 3.3 `app/services/riesgo.py` — un tercer scorer, código muerto

Calcula `Proveedor.nivel_riesgo` (una columna distinta a `categoria_riesgo`), pensado para correr como job nocturno de Celery:

```python
if multas_recientes > 0:       score += 3
if advertencias_recientes > 0: score += 1
if dias_desde_constitucion < 365: score += 2
if pep_count > 0:               score += 4
if max_contratos_entidad > 10:  score += 2
# score >= 5 -> alto · score >= 2 -> medio · si no, bajo
```

Confirmado que **nunca se ejecuta**: no hay ninguna tarea de Celery registrada que lo invoque, y no hay ningún import de este módulo en el resto del backend. Además la tabla `proveedores_detalle` que necesitaría está vacía.

### 3.4 `ConfiguracionMotorRiesgo` — un cuarto set de pesos, en la UI de Configuración

Editable desde `/configuracion` en el frontend (`app/schemas/configuracion.py`):

```python
peso_modalidad_sensible: int = 20
peso_baja_competencia: int = 25
peso_justificacion_debil: int = 17
peso_valor_cercano_precio_base: int = 20
peso_descripcion_generica: int = 10
umbral_riesgo_bajo: int = 39
umbral_riesgo_medio: int = 69
umbral_riesgo_alto: int = 100
```

El propio código del backend documenta que **esto es un stub de UI**: el comentario en `configuracion.py` dice textualmente que estos pesos "HOY no alimentan el motor de scoring real" y que conectar ambos sistemas es trabajo aparte. Es decir: el usuario puede cambiar estos números desde la pantalla de Configuración, pero eso hoy no afecta ningún score real de ningún contrato.

### 3.5 Resumen — ¿cuántas heurísticas tenemos, entonces?

| Fuente | # señales/heurísticas | ¿Lógica de condición disponible? | ¿Corre sobre datos reales hoy? |
|---|---|---|---|
| Datos ya en la BD de producción | 3 scores + categoría, origen de solo 2 flags reales (`modalidad_sensible`, `proveedor_nuevo`) | No — el generador se perdió | Sí (son los que ve el usuario) |
| `Agente_Red` | 9 pesos definidos, 8 con condición real, 1 sin disparo (`consorcios_relacionados`) | Sí, completa | Sí, pero para el Mapa de Relaciones — nunca escribió a Postgres |
| `app/services/riesgo.py` | 5 condiciones aditivas | Sí, completa | No — código muerto, sin trigger |
| `ConfiguracionMotorRiesgo` (UI) | 5 pesos + 3 umbrales | N/A (son solo números guardados, no hay condición que los use) | No — confirmado desconectado por el propio código |

**Ninguna de las cuatro coincide exactamente con las otras** en nombres de señales, pesos ni umbrales. La más completa y auditable es la de `Agente_Red`, pero es un sistema aparte para el grafo de relaciones, no el motor que puntuó los 99,353 contratos que ve el usuario en Dashboard/Contratos/Alertas.

**Conclusión práctica:** si se quiere tener un motor de heurísticas único, documentado y realmente conectado a lo que el usuario ve, hace falta decidir cuál de estos cuatro (probablemente una versión unificada basada en `Agente_Red`, que es la más completa) se convierte en la fuente de verdad, escribir su lógica de condiciones para los ~10 tipos de señal, y conectarla tanto a la tabla `analisis_riesgo`/`flags_deteccion` como al panel de Configuración — hoy son cuatro sistemas que no se hablan entre sí.

---

## 4. Notas relacionadas (contexto de esta auditoría)

- **4.1 — Mapa de relaciones**: el endpoint `/relaciones/grafo` es real y consulta las tablas correctas, pero como `nit_proveedor` está vacío en todos los contratos, hoy devuelve solo el nodo de la entidad central para cualquier búsqueda. El frontend ya está conectado a este endpoint real (ya no usa datos mock) y muestra un estado honesto ("Sin relaciones registradas") en vez de inventar un grafo.
- **4.2 — `Agente_Red`**: expone `/analisis/casos` y `/analisis/grafo-red`, pero como su capa de narrativa de IA nunca se ejecutó (modo mock), esos endpoints no están conectados al frontend todavía — mostrarían textos vacíos si se conectaran hoy.
- **4.3 — Proveedores/Personas/Sanciones/PEP**: todo el subsistema (`app/models/proveedor.py`, endpoints `proveedores.py`/`personas.py`) está construido contra tablas 100% vacías. Es infraestructura lista, sin datos cargados.
- **4.4 — Configuración → Motor de riesgo**: la pantalla permite editar pesos/umbrales, pero (ver §3.4) eso no afecta ningún score real todavía.

---

*Generado a partir de auditoría directa de código el 17 de agosto de 2026. Si se vuelve a ejecutar el pipeline de scoring o se reconstruye el script perdido, este documento debe actualizarse — hoy documenta lo que el código permite verificar, no lo que originalmente se planeó.*
