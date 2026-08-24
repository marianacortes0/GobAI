import { useState } from 'react'
import { Save, RotateCcw, Shield, CheckCircle, Brain, Activity, FlaskConical, Loader2 } from 'lucide-react'
import { KPICard } from '@/components/common/KPICard'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { useConfiguracionActual, useConfiguracionStatus, useGuardarConfiguracion, useRestaurarConfiguracion, useExportarConfiguracion } from '@/hooks/useConfiguracion'
import { useToast } from '@/hooks/useToast'
import type { ConfiguracionCompleta, SystemStatus, CambioReciente } from '@/types/configuracion.types'
import { ConfigTabs } from './components/ConfigTabs'
import { SeccionGeneral } from './components/SeccionGeneral'
import { SeccionDatos } from './components/SeccionDatos'
import { SeccionMotorRiesgo } from './components/SeccionMotorRiesgo'
import { SeccionIA } from './components/SeccionIA'
import { SeccionAlertas } from './components/SeccionAlertas'
import { SeccionRespaldo } from './components/SeccionRespaldo'
import { SeccionHistorial } from './components/SeccionHistorial'
import { SeccionSeguridad } from './components/SeccionSeguridad'
import { ResumenSidebar } from './components/ResumenSidebar'

const MOCK_STATUS: SystemStatus = {
  parametrosActivos: 24,
  reglasRiesgo: 12,
  automatizaciones: 6,
  estado: 'OPERATIVO',
  scoreGeneral: 92,
  secopConectado: true,
  modeloIAActivo: true,
  reglasActivas: 12,
  alertasActivas: 12,
}

const MOCK_CONFIGURACION: ConfiguracionCompleta = {
  general: {
    nombreSistema: 'GobIA Auditor - Demo',
    ambiente: 'PRODUCCION',
    idioma: 'Español',
    zona_horaria: 'America/Bogota',
    modoExplicableActivado: true,
    registroAuditoria: true,
  },
  datos: {
    fuenteDatos: 'SECOP II',
    tipoConexion: 'API pública',
    frecuenciaActualizacion: 'Diaria',
    secopConectado: true,
    sincronizacionAutomatica: true,
    ultimaSincronizacion: '24/05/2025 08:30 a. m.',
  },
  motorRiesgo: {
    pesoModalidadSensible: 20,
    pesoBajaCompetencia: 25,
    pesoJustificacionDebil: 17,
    pesoValorCercanoPrecioBase: 20,
    pesoDescripcionGenerica: 10,
    umbralRiesgoBajo: 39,
    umbralRiesgoMedio: 69,
    umbralRiesgoAlto: 100,
  },
  ia: {
    modeloPrincipal: 'LLM + motor de reglas',
    temperatura: 0.2,
    maxContratosPorLote: 20,
    entradasActivas: ['Descripción', 'Justificación', 'Modalidad', 'Proveedores', 'Valor base'],
    analisisTextual: true,
    evidenciaTextual: true,
    resumenesAutomaticos: true,
  },
  alertas: {
    alertasCriticas: true,
    riesgoAlto: true,
    resumenDiario: true,
    resumenSemanal: false,
    canalPrincipal: 'Correo electrónico',
    destinatarios: 'control.interno@entidad.gov.co',
  },
}

const MOCK_CAMBIOS_RECIENTES: CambioReciente[] = [
  { campo: 'Frecuencia de actualización', valor: 'ajustada a diaria', fecha: 'Hoy, 08:30 a. m.' },
  { campo: 'Ponderación de baja competencia', valor: 'actualizada', fecha: 'Ayer, 04:15 p. m.' },
  { campo: 'Resumen diario', valor: 'habilitado', fecha: 'Ayer, 09:20 a. m.' },
]

export function ConfiguracionPage() {
  const toast = useToast()
  const { data: configData, isLoading: configLoading } = useConfiguracionActual()
  const { data: statusData, isLoading: statusLoading } = useConfiguracionStatus()
  const { mutate: guardar, isPending: guardando } = useGuardarConfiguracion()
  const { mutate: restaurar, isPending: restaurando } = useRestaurarConfiguracion()
  const { mutate: exportar, isPending: exportando } = useExportarConfiguracion()

  const isDemo = !configLoading && !configData

  const [config, setConfig] = useState<ConfiguracionCompleta | null>(null)
  const [seededFrom, setSeededFrom] = useState<ConfiguracionCompleta | null>(null)

  const source = configData ?? (!configLoading ? MOCK_CONFIGURACION : null)
  if (source && source !== seededFrom) {
    setSeededFrom(source)
    setConfig(source)
  }

  const status = statusData ?? MOCK_STATUS

  function handleGuardar() {
    if (!config) return
    guardar(config, {
      onSuccess: () => {
        toast.success('Configuración guardada correctamente')
        setSeededFrom(config)
      },
      onError: () => toast.error('No se pudo guardar la configuración'),
    })
  }

  function handleRestaurar() {
    restaurar(undefined, {
      onSuccess: (restored) => {
        setConfig(restored)
        setSeededFrom(restored)
        toast.success('Valores restaurados')
      },
      onError: () => toast.error('No se pudo restaurar la configuración'),
    })
  }

  function handleExportar() {
    exportar(undefined, {
      onSuccess: (blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'configuracion-gobia-auditor.json'
        a.click()
        URL.revokeObjectURL(url)
        toast.success('Parámetros exportados')
      },
      onError: () => toast.error('No se pudo exportar la configuración'),
    })
  }

  if (!config) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Configuración</h1>
            <p className="text-sm text-slate-500 mt-0.5">Administra parámetros del sistema, reglas de riesgo, automatizaciones e integraciones de GobIA Auditor.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={handleRestaurar} disabled={restaurando} className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 disabled:opacity-60">
              {restaurando ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />} Restaurar valores
            </button>
            <button onClick={handleGuardar} disabled={guardando} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60">
              {guardando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Guardar cambios
            </button>
          </div>
        </div>

        {isDemo && (
          <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            <FlaskConical className="w-4 h-4 text-amber-500 shrink-0" />
            <span><strong>Modo demo:</strong> el backend no está disponible. Los datos mostrados son de ejemplo.</span>
          </div>
        )}

        {statusLoading ? <LoadingSpinner /> : (
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <KPICard title="Parámetros activos" value={status.parametrosActivos} subtitle="Configuración vigente" icon={Activity} />
            <KPICard title="Reglas de riesgo" value={status.reglasRiesgo} subtitle="Ponderaciones definidas" icon={Shield} iconBg="bg-orange-50" iconColor="text-orange-500" />
            <KPICard title="Automatizaciones" value={status.automatizaciones} subtitle="Flujos activos" icon={Brain} iconBg="bg-blue-50" iconColor="text-blue-500" />
            <KPICard title="Estado del sistema" value="Operativo" subtitle="Sincronización estable" icon={CheckCircle} iconBg="bg-green-50" iconColor="text-green-500" />
          </div>
        )}

        <ConfigTabs />

        <div className="space-y-4">
          <SeccionGeneral general={config.general} onChange={(patch) => setConfig((c) => c && { ...c, general: { ...c.general, ...patch } })} />
          <SeccionDatos datos={config.datos} onChange={(patch) => setConfig((c) => c && { ...c, datos: { ...c.datos, ...patch } })} />

          <SeccionMotorRiesgo motorRiesgo={config.motorRiesgo} onChange={(patch) => setConfig((c) => c && { ...c, motorRiesgo: { ...c.motorRiesgo, ...patch } })} />

          <SeccionIA ia={config.ia} onChange={(patch) => setConfig((c) => c && { ...c, ia: { ...c.ia, ...patch } })} />
          <SeccionAlertas alertas={config.alertas} onChange={(patch) => setConfig((c) => c && { ...c, alertas: { ...c.alertas, ...patch } })} alertasActivas={status.alertasActivas} />
          <SeccionRespaldo />
          <SeccionHistorial />
          <SeccionSeguridad />
        </div>
      </div>

      <ResumenSidebar
        status={status}
        cambiosRecientes={MOCK_CAMBIOS_RECIENTES}
        onGuardar={handleGuardar}
        guardando={guardando}
        onExportar={handleExportar}
        exportando={exportando}
      />
    </div>
  )
}
