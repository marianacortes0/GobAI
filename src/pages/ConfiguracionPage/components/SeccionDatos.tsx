import { Wifi, FileText, Database, Loader2 } from 'lucide-react'
import type { ConfiguracionDatos } from '@/types/configuracion.types'
import { useProbarConexionSecop } from '@/hooks/useConfiguracion'
import { useToast } from '@/hooks/useToast'
import { Section, Toggle, Pill, FieldLabel, inputClass, selectClass } from './ui'
import { formatTimestamp } from '@/utils/formatters'

interface Props {
  datos: ConfiguracionDatos
  onChange: (patch: Partial<ConfiguracionDatos>) => void
}

export function SeccionDatos({ datos, onChange }: Props) {
  const toast = useToast()
  const { mutate: probarConexion, isPending: probando } = useProbarConexionSecop()

  function handleProbarConexion() {
    probarConexion(undefined, {
      onSuccess: (res) => (res.conectado ? toast.success(res.mensaje || 'Conexión con SECOP II exitosa') : toast.error(res.mensaje || 'No se pudo conectar a SECOP II')),
      onError: () => toast.error('No se pudo probar la conexión'),
    })
  }

  return (
    <Section id="section-datos" title="2. Datos e integraciones">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Fuente principal</FieldLabel>
          <select value={datos.fuenteDatos} onChange={(e) => onChange({ fuenteDatos: e.target.value })} className={selectClass}>
            <option value="SECOP II">SECOP II</option>
          </select>
        </div>
        <div>
          <FieldLabel>Tipo de conexión</FieldLabel>
          <select value={datos.tipoConexion} onChange={(e) => onChange({ tipoConexion: e.target.value })} className={selectClass}>
            <option value="API pública">API pública</option>
            <option value="Archivo plano">Archivo plano</option>
          </select>
        </div>
        <div>
          <FieldLabel>Frecuencia de actualización</FieldLabel>
          <select value={datos.frecuenciaActualizacion} onChange={(e) => onChange({ frecuenciaActualizacion: e.target.value })} className={selectClass}>
            <option>Diaria</option>
            <option>Cada 6 horas</option>
            <option>Cada 4 horas</option>
          </select>
        </div>
        <div>
          <FieldLabel>Última sincronización</FieldLabel>
          <input value={formatTimestamp(datos.ultimaSincronizacion)} readOnly className={`${inputClass} bg-slate-50 text-slate-500`} />
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <FieldLabel>Estado</FieldLabel>
        <Pill color={datos.secopConectado ? 'green' : 'red'}>{datos.secopConectado ? 'Conectado' : 'Desconectado'}</Pill>
      </div>
      <Toggle
        label="Sincronización automática"
        checked={datos.sincronizacionAutomatica}
        onChange={(v) => onChange({ sincronizacionAutomatica: v })}
      />
      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
        <button onClick={handleProbarConexion} disabled={probando} className="flex items-center gap-2 px-3 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 disabled:opacity-60">
          {probando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wifi className="w-4 h-4" />} Probar conexión
        </button>
        <button onClick={() => toast.info('Los logs de sincronización estarán disponibles próximamente')} className="flex items-center gap-2 px-3 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50">
          <FileText className="w-4 h-4" /> Ver logs
        </button>
        <button onClick={() => toast.info('La configuración de cache estará disponible próximamente')} className="flex items-center gap-2 px-3 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50">
          <Database className="w-4 h-4" /> Configurar cache
        </button>
      </div>
    </Section>
  )
}
