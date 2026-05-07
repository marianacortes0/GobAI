# Matriz general de interfaces — GobIA Auditor

| Menú / Interfaz   | Propósito principal                                       | Qué se puede hacer                                           | Qué no se puede hacer                                        | Diferencia frente a otras interfaces                         |
| ----------------- | --------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **Dashboard**     | Vista ejecutiva del estado general del riesgo contractual | Ver indicadores globales, contratos priorizados, distribución de riesgo y detalle rápido de un contrato | No administrar reglas, no configurar el sistema, no gestionar reportes avanzados | Es la pantalla de **monitoreo general** y resumen ejecutivo  |
| **Contratos**     | Consultar, filtrar y revisar contratos SECOP II           | Buscar contratos, aplicar filtros, ver listado, abrir detalle, consultar SECOP, enviar contrato a análisis IA | No modifica contratos, no decide corrupción, no configura alertas ni reglas | Es la pantalla de **exploración y gestión de contratos**     |
| **Análisis IA**   | Analizar un contrato específico con reglas + LLM          | Ejecutar análisis, revisar score, ver hallazgos, evidencia textual, trazabilidad y recomendaciones | No busca masivamente contratos, no gestiona usuarios, no cambia parámetros del sistema | Es la pantalla de **explicabilidad técnica del análisis**    |
| **Alertas**       | Gestionar señales de riesgo detectadas automáticamente    | Ver alertas, priorizar, filtrar por severidad, revisar detalle, marcar como revisada, escalar revisión | No genera reportes completos, no cambia reglas de scoring, no edita datos SECOP | Es la pantalla de **gestión operativa de riesgos detectados** |
| **Reportes**      | Consolidar resultados y exportar informes                 | Generar reportes, ver gráficos, descargar PDF/XLSX, compartir, consultar historial | No ejecuta análisis profundo de un contrato individual, no cambia configuración | Es la pantalla de **análisis consolidado y documentación ejecutiva** |
| **Configuración** | Administrar parámetros internos del sistema               | Ajustar reglas, pesos, umbrales, IA, alertas, usuarios, integraciones, respaldos | No analiza contratos directamente, no muestra ranking operativo | Es la pantalla de **administración del sistema**             |

------

# 1. Interfaz: Dashboard

## Propósito

El **Dashboard** es la pantalla principal de monitoreo. Sirve para que el usuario entienda rápidamente el estado general de la contratación analizada: cuántos contratos se han revisado, cuántos tienen riesgo alto, qué entidades están siendo monitoreadas y cuáles contratos requieren atención prioritaria.

------

## Qué se puede hacer

| Funcionalidad                   | Descripción                                                  |
| ------------------------------- | ------------------------------------------------------------ |
| Ver KPIs generales              | Contratos analizados, riesgo alto, riesgo medio, entidades monitoreadas |
| Filtrar contratos               | Por departamento, entidad, modalidad y rango de valor        |
| Consultar contratos priorizados | Ver una tabla con score, riesgo, entidad, procedimiento, modalidad y señales |
| Revisar detalle rápido          | Seleccionar un contrato y ver score, señales y resumen IA    |
| Abrir proceso SECOP             | Acceder al enlace público del proceso original               |
| Ver distribución de riesgo      | Consultar gráfico de contratos por riesgo bajo, medio y alto |

------

## Qué no se puede hacer

| Restricción                           | Explicación                                             |
| ------------------------------------- | ------------------------------------------------------- |
| No configura reglas                   | Los pesos del score se administran en **Configuración** |
| No ejecuta análisis profundo completo | El análisis detallado se hace en **Análisis IA**        |
| No gestiona alertas                   | La gestión de alertas se realiza en **Alertas**         |
| No genera informes formales           | Los reportes se generan desde **Reportes**              |
| No edita información SECOP            | Los datos son públicos y solo se consultan              |

------

## Diferencia clave

El Dashboard responde a esta pregunta:

```
¿Qué está pasando en general con los riesgos de opacidad?
```

Es una pantalla de **visión ejecutiva**, no de operación detallada.

------

# 2. Interfaz: Contratos

## Propósito

La interfaz **Contratos** permite buscar, filtrar y revisar procesos contractuales provenientes del SECOP II. Es la pantalla donde el usuario explora el universo de contratos disponibles antes de analizarlos o priorizarlos.

El diccionario de datos SECOP II identifica campos como entidad, departamento, ciudad, ID del proceso, nombre del procedimiento, descripción, modalidad, precio base, proveedores, valor adjudicado, tipo de contrato, estado y URL del proceso, que son los insumos principales de esta interfaz. 

------

## Qué se puede hacer

| Funcionalidad            | Descripción                                                  |
| ------------------------ | ------------------------------------------------------------ |
| Buscar contratos         | Por entidad, proceso, proveedor o palabra clave              |
| Filtrar por departamento | Ejemplo: Cundinamarca, Antioquia, Valle del Cauca            |
| Filtrar por modalidad    | Contratación directa, licitación pública, mínima cuantía, etc. |
| Filtrar por estado       | Publicado, adjudicado, en análisis                           |
| Filtrar por riesgo       | Bajo, medio o alto                                           |
| Filtrar por fecha        | Rango de publicación del proceso                             |
| Ver listado de contratos | Tabla con ID, entidad, procedimiento, modalidad, estado, valor, riesgo y fecha |
| Ver detalle del contrato | Panel lateral con información contractual                    |
| Abrir proceso en SECOP   | Acceso al enlace público original                            |
| Descargar ficha          | Exportar o preparar ficha resumida del contrato              |
| Enviar a análisis IA     | Botón para analizar el contrato seleccionado                 |

------

## Qué no se puede hacer

| Restricción                                          | Explicación                                                  |
| ---------------------------------------------------- | ------------------------------------------------------------ |
| No modifica contratos                                | SECOP II es fuente pública de consulta, no se edita desde la app |
| No cambia score manualmente                          | El score se calcula con reglas e IA                          |
| No administra usuarios                               | Eso corresponde a **Configuración**                          |
| No consolida informes ejecutivos                     | Eso se hace en **Reportes**                                  |
| No muestra trazabilidad completa del razonamiento IA | Eso se revisa en **Análisis IA**                             |

------

## Diferencia clave

La pantalla Contratos responde a esta pregunta:

```
¿Qué contratos existen y cuáles quiero revisar?
```

Es la pantalla de **consulta, filtrado y selección de contratos**.

------

# 3. Interfaz: Análisis IA

## Propósito

La interfaz **Análisis IA** es el núcleo explicativo del sistema. Permite analizar un contrato específico usando un enfoque híbrido: **motor de reglas + modelo de lenguaje LLM**.

Aquí se explica por qué un contrato recibió determinado score.

------

## Qué se puede hacer

| Funcionalidad              | Descripción                                                  |
| -------------------------- | ------------------------------------------------------------ |
| Seleccionar contrato       | Elegir un proceso específico para analizar                   |
| Elegir modo de análisis    | Por ejemplo: análisis de opacidad                            |
| Ver modelo usado           | LLM + motor de reglas                                        |
| Ejecutar análisis          | Procesar el contrato seleccionado                            |
| Ver score total            | Ejemplo: 82/100                                              |
| Ver señales críticas       | Cantidad de señales que requieren revisión                   |
| Ver hallazgos IA           | Patrones textuales detectados                                |
| Ver confianza del análisis | Consistencia entre reglas e IA                               |
| Revisar resumen ejecutivo  | Explicación generada por IA                                  |
| Ver factores ponderados    | Modalidad sensible, baja competencia, justificación débil, etc. |
| Ver trazabilidad           | Datos normalizados, reglas aplicadas, texto analizado y score consolidado |
| Revisar evidencia textual  | Fragmentos del contrato que soportan alertas                 |
| Ver recomendaciones        | Acciones sugeridas para revisión humana                      |
| Descargar informe          | Exportar análisis individual                                 |
| Abrir proceso SECOP        | Ver fuente pública original                                  |

------

## Qué no se puede hacer

| Restricción                                       | Explicación                                             |
| ------------------------------------------------- | ------------------------------------------------------- |
| No busca contratos masivamente                    | La búsqueda se realiza en **Contratos**                 |
| No administra alertas operativas                  | Eso corresponde a **Alertas**                           |
| No modifica reglas de riesgo                      | Se ajustan en **Configuración**                         |
| No genera reporte consolidado de varios contratos | Eso corresponde a **Reportes**                          |
| No determina corrupción                           | Solo identifica señales de opacidad y prioriza revisión |

------

## Diferencia clave

La pantalla Análisis IA responde a esta pregunta:

```
¿Por qué este contrato fue clasificado con este nivel de riesgo?
```

Es la pantalla de **explicabilidad, evidencia y razonamiento del agente IA**.

------

# 4. Interfaz: Alertas

## Propósito

La interfaz **Alertas** permite gestionar las señales de riesgo que el sistema detecta automáticamente. Es una pantalla operativa para priorizar, revisar, dar seguimiento y cerrar alertas.

------

## Qué se puede hacer

| Funcionalidad              | Descripción                                                  |
| -------------------------- | ------------------------------------------------------------ |
| Ver alertas activas        | Total de alertas pendientes de revisión                      |
| Ver alertas críticas       | Alertas de prioridad inmediata                               |
| Ver alertas en seguimiento | Alertas que ya están siendo revisadas                        |
| Ver alertas resueltas      | Alertas cerradas                                             |
| Buscar alertas             | Por entidad, proceso, proveedor o tipo de alerta             |
| Filtrar por severidad      | Crítica, alta, media, baja                                   |
| Filtrar por estado         | Nueva, en revisión, en seguimiento, resuelta                 |
| Filtrar por tipo de alerta | Baja competencia, justificación débil, proveedor único, etc. |
| Filtrar por departamento   | Acotar territorialmente                                      |
| Ver tabla de alertas       | Severidad, tipo, entidad, proceso, señal, fecha y estado     |
| Ver detalle de alerta      | Información completa del caso seleccionado                   |
| Ver prioridad              | Score de atención sugerido                                   |
| Revisar acciones sugeridas | Recomendaciones para revisión                                |
| Analizar con IA            | Profundizar una alerta usando IA                             |
| Ver proceso SECOP          | Abrir fuente original                                        |
| Marcar como revisada       | Cerrar o registrar revisión de una alerta                    |
| Exportar alertas           | Descargar lista o reporte operativo                          |

------

## Qué no se puede hacer

| Restricción                                      | Explicación                                  |
| ------------------------------------------------ | -------------------------------------------- |
| No cambia los criterios de generación de alertas | Se configuran en **Configuración**           |
| No crea contratos                                | Solo trabaja sobre datos existentes de SECOP |
| No reemplaza revisión humana                     | Solo prioriza señales                        |
| No genera informes ejecutivos completos          | Eso corresponde a **Reportes**               |
| No modifica el análisis base del LLM             | Eso se revisa en **Análisis IA**             |

------

## Diferencia clave

La pantalla Alertas responde a esta pregunta:

```
¿Qué riesgos detectados necesitan atención y cuál es su estado de gestión?
```

Es la pantalla de **gestión operativa de hallazgos**.

------

# 5. Interfaz: Reportes

## Propósito

La interfaz **Reportes** consolida la información del sistema para generar informes ejecutivos, gráficos, resúmenes y documentos descargables.

Es útil para entregar resultados a jurados, equipos de control interno, veedurías, directivos o ciudadanía.

------

## Qué se puede hacer

| Funcionalidad                    | Descripción                                                  |
| -------------------------------- | ------------------------------------------------------------ |
| Configurar tipo de reporte       | Ejecutivo de opacidad, resumen mensual, alertas críticas, etc. |
| Seleccionar período              | Últimos 30 días, mes actual, rango personalizado             |
| Seleccionar departamento         | Ejemplo: Cundinamarca                                        |
| Elegir formato                   | PDF, XLSX u otro formato                                     |
| Programar reporte                | Crear generación automática                                  |
| Generar reporte                  | Crear informe consolidado                                    |
| Seleccionar cobertura            | Contratos, alertas, análisis IA, entidades, exportaciones    |
| Ver reportes generados           | Total de reportes disponibles                                |
| Ver programados                  | Reportes automáticos activos                                 |
| Ver descargas                    | Cantidad de descargas realizadas                             |
| Ver riesgo promedio              | Índice consolidado del período                               |
| Analizar resumen ejecutivo       | Texto con conclusiones del período                           |
| Ver gráficos                     | Distribución de riesgo, alertas por entidad, evolución del riesgo |
| Ver hallazgos priorizados        | Principales patrones detectados                              |
| Descargar reporte                | Exportar archivo                                             |
| Compartir reporte                | Enviar o preparar enlace                                     |
| Ver historial                    | Consultar reportes anteriores                                |
| Revisar historial de exportación | PDF, XLSX o reportes enviados                                |

------

## Qué no se puede hacer

| Restricción                                         | Explicación                          |
| --------------------------------------------------- | ------------------------------------ |
| No analiza contratos individualmente en profundidad | Eso se hace en **Análisis IA**       |
| No gestiona alertas una por una                     | Eso se hace en **Alertas**           |
| No consulta contratos como explorador principal     | Eso se hace en **Contratos**         |
| No cambia configuración del sistema                 | Eso se hace en **Configuración**     |
| No determina responsabilidades jurídicas            | Solo presenta hallazgos y tendencias |

------

## Diferencia clave

La pantalla Reportes responde a esta pregunta:

```
¿Qué conclusiones consolidadas puedo presentar o exportar?
```

Es la pantalla de **síntesis, evidencia agregada y comunicación ejecutiva**.

------

# 6. Interfaz: Configuración

## Propósito

La interfaz **Configuración** permite administrar los parámetros internos de GobIA Auditor: reglas de riesgo, pesos, umbrales, IA, integraciones, usuarios, alertas, respaldos y seguridad.

------

## Qué se puede hacer

| Funcionalidad                      | Descripción                                                  |
| ---------------------------------- | ------------------------------------------------------------ |
| Configurar parámetros generales    | Nombre de instancia, ambiente, idioma, zona horaria          |
| Activar modo explicable            | Mostrar razonamiento y evidencia del score                   |
| Activar registro de auditoría      | Guardar trazabilidad de acciones                             |
| Configurar fuente de datos         | SECOP II como fuente principal                               |
| Configurar conexión                | API pública, frecuencia, sincronización automática           |
| Probar conexión                    | Validar acceso a datos                                       |
| Ver logs                           | Revisar eventos técnicos                                     |
| Configurar caché                   | Mejorar rendimiento                                          |
| Ajustar motor de riesgo            | Pesos de modalidad, competencia, justificación, precio, descripción |
| Ajustar umbrales                   | Riesgo bajo, medio y alto                                    |
| Configurar IA                      | Modelo principal, temperatura, análisis textual, evidencia   |
| Definir lote máximo                | Cantidad máxima de contratos por análisis                    |
| Configurar alertas                 | Activar alertas críticas, riesgo alto, resumen diario/semanal |
| Configurar canal de notificación   | Correo electrónico u otro canal                              |
| Gestionar usuarios                 | Ver roles, invitar usuarios, administrar permisos            |
| Gestionar respaldos                | Ejecutar respaldo y ver frecuencia                           |
| Ver historial de cambios           | Revisar cambios de configuración                             |
| Ejecutar verificación de seguridad | Revisar estado del sistema                                   |
| Guardar configuración              | Aplicar cambios                                              |
| Exportar parámetros                | Descargar configuración                                      |
| Restaurar valores                  | Volver a parámetros base                                     |

------

## Qué no se puede hacer

| Restricción                                | Explicación                                 |
| ------------------------------------------ | ------------------------------------------- |
| No consulta contratos directamente         | Eso se hace en **Contratos**                |
| No muestra análisis contractual individual | Eso se hace en **Análisis IA**              |
| No gestiona alertas operativas             | Eso se hace en **Alertas**                  |
| No genera reportes ejecutivos              | Eso se hace en **Reportes**                 |
| No modifica datos públicos de SECOP        | Solo configura cómo se consultan y analizan |

------

## Diferencia clave

La pantalla Configuración responde a esta pregunta:

```
¿Cómo quiero que funcione GobIA Auditor?
```

Es la pantalla de **administración, parametrización y control técnico**.

------

# Matriz funcional detallada por capacidad

| Funcionalidad / Capacidad                  | Dashboard | Contratos | Análisis IA | Alertas | Reportes | Configuración                       |
| ------------------------------------------ | --------- | --------- | ----------- | ------- | -------- | ----------------------------------- |
| Ver resumen general de riesgo              | Sí        | Parcial   | No          | Parcial | Sí       | No                                  |
| Consultar contratos SECOP II               | Parcial   | Sí        | No          | Parcial | Parcial  | No                                  |
| Buscar contratos                           | No        | Sí        | No          | No      | No       | No                                  |
| Filtrar por entidad/departamento/modalidad | Sí        | Sí        | No          | Sí      | Sí       | No                                  |
| Ver tabla de contratos                     | Sí        | Sí        | No          | No      | Parcial  | No                                  |
| Ver detalle contractual                    | Sí        | Sí        | Sí          | Sí      | Parcial  | No                                  |
| Ejecutar análisis IA                       | No        | Parcial   | Sí          | Parcial | No       | No                                  |
| Ver evidencia textual                      | No        | No        | Sí          | Parcial | Parcial  | No                                  |
| Ver trazabilidad del score                 | No        | No        | Sí          | Parcial | Parcial  | Sí, configuración del método        |
| Ver señales de alerta                      | Sí        | Sí        | Sí          | Sí      | Sí       | No                                  |
| Gestionar alertas                          | No        | No        | No          | Sí      | No       | Configura reglas, no gestiona casos |
| Marcar alerta como revisada                | No        | No        | No          | Sí      | No       | No                                  |
| Generar reportes                           | No        | No        | No          | Parcial | Sí       | No                                  |
| Descargar informes                         | Parcial   | Parcial   | Sí          | Parcial | Sí       | Sí, parámetros                      |
| Ver gráficos agregados                     | Sí        | No        | Parcial     | Sí      | Sí       | No                                  |
| Configurar reglas de riesgo                | No        | No        | No          | No      | No       | Sí                                  |
| Configurar pesos del score                 | No        | No        | No          | No      | No       | Sí                                  |
| Configurar IA / LLM                        | No        | No        | No          | No      | No       | Sí                                  |
| Gestionar usuarios                         | No        | No        | No          | No      | No       | Sí                                  |
| Configurar notificaciones                  | No        | No        | No          | No      | No       | Sí                                  |
| Exportar datos o parámetros                | No        | Parcial   | Sí          | Sí      | Sí       | Sí                                  |
| Abrir proceso en SECOP                     | Sí        | Sí        | Sí          | Sí      | Parcial  | No                                  |

------

# Diferenciación rápida por tipo de usuario

| Tipo de usuario           | Interfaz más importante        | Uso principal                                        |
| ------------------------- | ------------------------------ | ---------------------------------------------------- |
| Directivo / jurado        | Dashboard, Reportes            | Ver impacto, resultados y conclusiones               |
| Analista de datos         | Contratos, Análisis IA         | Revisar contratos y explicar scores                  |
| Auditor / control interno | Alertas, Análisis IA           | Priorizar revisión y validar evidencia               |
| Administrador del sistema | Configuración                  | Ajustar reglas, IA, usuarios y notificaciones        |
| Ciudadano / veeduría      | Dashboard, Contratos, Reportes | Entender riesgos y consultar fuentes públicas        |
| Equipo técnico            | Configuración, Análisis IA     | Ver reglas, trazabilidad y funcionamiento del agente |

------

# Mapa de navegación sugerido

```
Dashboard
   ├── Ver contratos priorizados
   ├── Abrir detalle rápido
   └── Ir a Contratos

Contratos
   ├── Buscar y filtrar procesos
   ├── Ver detalle contractual
   ├── Ver en SECOP
   └── Enviar a Análisis IA

Análisis IA
   ├── Ejecutar análisis
   ├── Ver score
   ├── Ver evidencia textual
   ├── Ver recomendaciones
   └── Descargar informe

Alertas
   ├── Ver alertas activas
   ├── Priorizar por severidad
   ├── Analizar con IA
   ├── Marcar como revisada
   └── Escalar revisión

Reportes
   ├── Generar reporte
   ├── Ver gráficos consolidados
   ├── Descargar PDF/XLSX
   ├── Compartir
   └── Ver historial

Configuración
   ├── Ajustar reglas
   ├── Configurar IA
   ├── Configurar notificaciones
   ├── Gestionar usuarios
   └── Guardar parámetros
```

------

# Resumen por interfaz en una frase

| Interfaz          | Frase de diferenciación                                     |
| ----------------- | ----------------------------------------------------------- |
| **Dashboard**     | “Muestra el estado general del riesgo contractual.”         |
| **Contratos**     | “Permite buscar y revisar procesos contractuales reales.”   |
| **Análisis IA**   | “Explica por qué un contrato tiene determinado score.”      |
| **Alertas**       | “Gestiona señales de riesgo que requieren atención.”        |
| **Reportes**      | “Consolida hallazgos para presentación y descarga.”         |
| **Configuración** | “Define cómo funciona el sistema, sus reglas y parámetros.” |

------

# Recomendación para documentarlo en el proyecto