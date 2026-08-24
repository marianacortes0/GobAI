export interface ConfiguracionGeneral {
  nombreSistema: string
  ambiente: 'PRODUCCION' | 'STAGING' | 'DESARROLLO'
  idioma: string
  zona_horaria: string
  modoExplicableActivado: boolean
  registroAuditoria: boolean
}

export interface ConfiguracionDatos {
  fuenteDatos: string
  tipoConexion: string
  frecuenciaActualizacion: string
  secopConectado: boolean
  sincronizacionAutomatica: boolean
  ultimaSincronizacion?: string
}

export interface ConfiguracionMotorRiesgo {
  pesoModalidadSensible: number
  pesoBajaCompetencia: number
  pesoJustificacionDebil: number
  pesoValorCercanoPrecioBase: number
  pesoDescripcionGenerica: number
  umbralRiesgoBajo: number
  umbralRiesgoMedio: number
  umbralRiesgoAlto: number
}

export interface ConfiguracionIA {
  modeloPrincipal: string
  temperatura: number
  maxContratosPorLote: number
  entradasActivas: string[]
  analisisTextual: boolean
  evidenciaTextual: boolean
  resumenesAutomaticos: boolean
}

export interface ConfiguracionAlertas {
  alertasCriticas: boolean
  riesgoAlto: boolean
  resumenDiario: boolean
  resumenSemanal: boolean
  canalPrincipal: string
  destinatarios: string
}

export interface ConfiguracionRespaldo {
  ultimoRespaldo: string
  frecuencia: string
}

export interface ConfiguracionHistorial {
  cambiosRegistrados: number
  ultimoCambio: string
}

export interface ConfiguracionSeguridad {
  estado: 'CORRECTA' | 'ALERTA' | 'CRITICA'
  ultimaVerificacion: string
}

export interface CambioReciente {
  campo: string
  valor: string
  fecha: string
}

export interface ConfiguracionCompleta {
  general: ConfiguracionGeneral
  datos: ConfiguracionDatos
  motorRiesgo: ConfiguracionMotorRiesgo
  ia: ConfiguracionIA
  alertas: ConfiguracionAlertas
}

export interface SystemStatus {
  parametrosActivos: number
  reglasRiesgo: number
  automatizaciones: number
  estado: 'OPERATIVO' | 'DEGRADADO' | 'FALLO'
  scoreGeneral: number
  secopConectado: boolean
  modeloIAActivo: boolean
  reglasActivas: number
  alertasActivas: number
}
