import api from './api'
import type {
  ConfiguracionCompleta,
  ConfiguracionRespaldo,
  ConfiguracionHistorial,
  ConfiguracionSeguridad,
  SystemStatus,
} from '@/types/configuracion.types'

type BackendGeneral = {
  nombre_sistema: string
  ambiente: 'PRODUCCION' | 'STAGING' | 'DESARROLLO'
  idioma: string
  zona_horaria: string
  modo_explicable_activado: boolean
  registro_auditoria: boolean
}

type BackendDatos = {
  fuente_datos: string
  tipo_conexion: string
  frecuencia_actualizacion: string
  secop_conectado: boolean
  sincronizacion_automatica: boolean
  ultima_sincronizacion: string | null
}

type BackendMotorRiesgo = {
  peso_modalidad_sensible: number
  peso_baja_competencia: number
  peso_justificacion_debil: number
  peso_valor_cercano_precio_base: number
  peso_descripcion_generica: number
  umbral_riesgo_bajo: number
  umbral_riesgo_medio: number
  umbral_riesgo_alto: number
}

type BackendIA = {
  modelo_principal: string
  temperatura: number
  max_contratos_por_lote: number
  entradas_activas: string[]
  analisis_textual: boolean
  evidencia_textual: boolean
  resumenes_automaticos: boolean
}

type BackendAlertas = {
  alertas_criticas: boolean
  riesgo_alto: boolean
  resumen_diario: boolean
  resumen_semanal: boolean
  canal_principal: string
  destinatarios: string
}

type BackendConfiguracionCompleta = {
  general: BackendGeneral
  datos: BackendDatos
  motor_riesgo: BackendMotorRiesgo
  ia: BackendIA
  alertas: BackendAlertas
}

type BackendSystemStatus = {
  parametros_activos: number
  reglas_riesgo: number
  automatizaciones: number
  estado: 'OPERATIVO' | 'DEGRADADO' | 'FALLO'
  score_general: number
  secop_conectado: boolean
  modelo_ia_activo: boolean
  reglas_activas: number
  alertas_activas: number
}

type BackendRespaldo = { ultimo_respaldo: string | null; frecuencia: string }
type BackendHistorial = { cambios_registrados: number; ultimo_cambio: string | null }
type BackendSeguridad = { estado: 'CORRECTA' | 'ALERTA' | 'CRITICA'; ultima_verificacion: string | null }

function mapConfiguracion(d: BackendConfiguracionCompleta): ConfiguracionCompleta {
  return {
    general: {
      nombreSistema: d.general.nombre_sistema,
      ambiente: d.general.ambiente,
      idioma: d.general.idioma,
      zona_horaria: d.general.zona_horaria,
      modoExplicableActivado: d.general.modo_explicable_activado,
      registroAuditoria: d.general.registro_auditoria,
    },
    datos: {
      fuenteDatos: d.datos.fuente_datos,
      tipoConexion: d.datos.tipo_conexion,
      frecuenciaActualizacion: d.datos.frecuencia_actualizacion,
      secopConectado: d.datos.secop_conectado,
      sincronizacionAutomatica: d.datos.sincronizacion_automatica,
      ultimaSincronizacion: d.datos.ultima_sincronizacion ?? undefined,
    },
    motorRiesgo: {
      pesoModalidadSensible: d.motor_riesgo.peso_modalidad_sensible,
      pesoBajaCompetencia: d.motor_riesgo.peso_baja_competencia,
      pesoJustificacionDebil: d.motor_riesgo.peso_justificacion_debil,
      pesoValorCercanoPrecioBase: d.motor_riesgo.peso_valor_cercano_precio_base,
      pesoDescripcionGenerica: d.motor_riesgo.peso_descripcion_generica,
      umbralRiesgoBajo: d.motor_riesgo.umbral_riesgo_bajo,
      umbralRiesgoMedio: d.motor_riesgo.umbral_riesgo_medio,
      umbralRiesgoAlto: d.motor_riesgo.umbral_riesgo_alto,
    },
    ia: {
      modeloPrincipal: d.ia.modelo_principal,
      temperatura: d.ia.temperatura,
      maxContratosPorLote: d.ia.max_contratos_por_lote,
      entradasActivas: d.ia.entradas_activas,
      analisisTextual: d.ia.analisis_textual,
      evidenciaTextual: d.ia.evidencia_textual,
      resumenesAutomaticos: d.ia.resumenes_automaticos,
    },
    alertas: {
      alertasCriticas: d.alertas.alertas_criticas,
      riesgoAlto: d.alertas.riesgo_alto,
      resumenDiario: d.alertas.resumen_diario,
      resumenSemanal: d.alertas.resumen_semanal,
      canalPrincipal: d.alertas.canal_principal,
      destinatarios: d.alertas.destinatarios,
    },
  }
}

function unmapConfiguracion(c: ConfiguracionCompleta): BackendConfiguracionCompleta {
  return {
    general: {
      nombre_sistema: c.general.nombreSistema,
      ambiente: c.general.ambiente,
      idioma: c.general.idioma,
      zona_horaria: c.general.zona_horaria,
      modo_explicable_activado: c.general.modoExplicableActivado,
      registro_auditoria: c.general.registroAuditoria,
    },
    datos: {
      fuente_datos: c.datos.fuenteDatos,
      tipo_conexion: c.datos.tipoConexion,
      frecuencia_actualizacion: c.datos.frecuenciaActualizacion,
      secop_conectado: c.datos.secopConectado,
      sincronizacion_automatica: c.datos.sincronizacionAutomatica,
      ultima_sincronizacion: c.datos.ultimaSincronizacion ?? null,
    },
    motor_riesgo: {
      peso_modalidad_sensible: c.motorRiesgo.pesoModalidadSensible,
      peso_baja_competencia: c.motorRiesgo.pesoBajaCompetencia,
      peso_justificacion_debil: c.motorRiesgo.pesoJustificacionDebil,
      peso_valor_cercano_precio_base: c.motorRiesgo.pesoValorCercanoPrecioBase,
      peso_descripcion_generica: c.motorRiesgo.pesoDescripcionGenerica,
      umbral_riesgo_bajo: c.motorRiesgo.umbralRiesgoBajo,
      umbral_riesgo_medio: c.motorRiesgo.umbralRiesgoMedio,
      umbral_riesgo_alto: c.motorRiesgo.umbralRiesgoAlto,
    },
    ia: {
      modelo_principal: c.ia.modeloPrincipal,
      temperatura: c.ia.temperatura,
      max_contratos_por_lote: c.ia.maxContratosPorLote,
      entradas_activas: c.ia.entradasActivas,
      analisis_textual: c.ia.analisisTextual,
      evidencia_textual: c.ia.evidenciaTextual,
      resumenes_automaticos: c.ia.resumenesAutomaticos,
    },
    alertas: {
      alertas_criticas: c.alertas.alertasCriticas,
      riesgo_alto: c.alertas.riesgoAlto,
      resumen_diario: c.alertas.resumenDiario,
      resumen_semanal: c.alertas.resumenSemanal,
      canal_principal: c.alertas.canalPrincipal,
      destinatarios: c.alertas.destinatarios,
    },
  }
}

function mapStatus(d: BackendSystemStatus): SystemStatus {
  return {
    parametrosActivos: d.parametros_activos,
    reglasRiesgo: d.reglas_riesgo,
    automatizaciones: d.automatizaciones,
    estado: d.estado,
    scoreGeneral: d.score_general,
    secopConectado: d.secop_conectado,
    modeloIAActivo: d.modelo_ia_activo,
    reglasActivas: d.reglas_activas,
    alertasActivas: d.alertas_activas,
  }
}

function mapRespaldo(d: BackendRespaldo): ConfiguracionRespaldo {
  return { ultimoRespaldo: d.ultimo_respaldo ?? '', frecuencia: d.frecuencia }
}

function mapHistorial(d: BackendHistorial): ConfiguracionHistorial {
  return { cambiosRegistrados: d.cambios_registrados, ultimoCambio: d.ultimo_cambio ?? '' }
}

function mapSeguridad(d: BackendSeguridad): ConfiguracionSeguridad {
  return { estado: d.estado, ultimaVerificacion: d.ultima_verificacion ?? '' }
}

export const configuracionService = {
  async getStatus(): Promise<SystemStatus> {
    const { data } = await api.get<BackendSystemStatus>('/configuracion/status')
    return mapStatus(data)
  },

  async obtener(): Promise<ConfiguracionCompleta> {
    const { data } = await api.get<BackendConfiguracionCompleta>('/configuracion')
    return mapConfiguracion(data)
  },

  async guardar(config: ConfiguracionCompleta): Promise<void> {
    await api.put('/configuracion', unmapConfiguracion(config))
  },

  async restaurar(): Promise<ConfiguracionCompleta> {
    const { data } = await api.post<BackendConfiguracionCompleta>('/configuracion/restaurar')
    return mapConfiguracion(data)
  },

  async exportar(): Promise<Blob> {
    const { data } = await api.get('/configuracion/exportar', { responseType: 'blob' })
    return data
  },

  async probarConexionSecop(): Promise<{ conectado: boolean; mensaje: string }> {
    const { data } = await api.post('/configuracion/probar-secop')
    return data
  },

  async getRespaldo(): Promise<ConfiguracionRespaldo> {
    const { data } = await api.get<BackendRespaldo>('/configuracion/respaldo')
    return mapRespaldo(data)
  },

  async realizarRespaldo(): Promise<ConfiguracionRespaldo> {
    const { data } = await api.post<BackendRespaldo>('/configuracion/respaldo')
    return mapRespaldo(data)
  },

  async getHistorial(): Promise<ConfiguracionHistorial> {
    const { data } = await api.get<BackendHistorial>('/configuracion/historial')
    return mapHistorial(data)
  },

  async getSeguridad(): Promise<ConfiguracionSeguridad> {
    const { data } = await api.get<BackendSeguridad>('/configuracion/seguridad')
    return mapSeguridad(data)
  },

  async ejecutarVerificacion(): Promise<ConfiguracionSeguridad> {
    const { data } = await api.post<BackendSeguridad>('/configuracion/seguridad/verificar')
    return mapSeguridad(data)
  },
}
