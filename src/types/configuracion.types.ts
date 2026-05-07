export interface ConfiguracionGeneral {
  nombreSistema: string
  ambiente: 'PRODUCCION' | 'STAGING' | 'DESARROLLO'
  idioma: string
  zona_horaria: string
  notificacionesEmail: boolean
  notificacionesPush: boolean
}

export interface ConfiguracionDatos {
  fuenteDatos: string
  frecuenciaActualizacion: string
  secopConectado: boolean
  ultimaSincronizacion?: string
}

export interface ConfiguracionMotorRiesgo {
  pesoAnomaliasTextuales: number
  pesoConcentracionProveedor: number
  pesoUrgenciasInjustificadas: number
  pesoFraccionamientoContratos: number
  pesoHistorialProveedor: number
  umbralRiesgoCritico: number
  umbralRiesgoAlto: number
  umbralRiesgoMedio: number
}

export interface ConfiguracionIA {
  modeloPrincipal: string
  modoAnalisis: string
  entradasActivas: string[]
  confianzaMinima: number
  explicabilidadActiva: boolean
}

export interface ConfiguracionAlertas {
  alertasAutomaticas: boolean
  emailNotificaciones: string
  frecuenciaResumen: string
  umbralAlertaCritica: number
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
  usuariosActivos: number
}
