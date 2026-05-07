import { useState } from 'react'
import { Save, RotateCcw, Download, Shield, CheckCircle, Wifi, Brain, Bell, Users, Database, Activity } from 'lucide-react'
import { KPICard } from '@/components/common/KPICard'
import { ScoreCircle } from '@/components/common/ScoreCircle'

type TabId = 'general' | 'riesgo' | 'ia' | 'alertas' | 'usuarios' | 'reportes'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left">
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        <span className="text-slate-400 text-lg">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="p-5 bg-white space-y-4">{children}</div>}
    </div>
  )
}

function Toggle({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked)
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-700">{label}</span>
      <button onClick={() => setChecked(!checked)} className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-slate-300'}`}>
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  )
}

function Slider({ label, min = 0, max = 100, defaultValue = 50 }: { label: string; min?: number; max?: number; defaultValue?: number }) {
  const [value, setValue] = useState(defaultValue)
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm text-slate-700">{label}</label>
        <span className="text-sm font-semibold text-blue-600">{value}%</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => setValue(Number(e.target.value))}
        className="w-full accent-blue-600" />
    </div>
  )
}

export function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState<TabId>('general')

  const tabs: { id: TabId; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'riesgo', label: 'Motor de riesgo' },
    { id: 'ia', label: 'IA y análisis' },
    { id: 'alertas', label: 'Alertas' },
    { id: 'usuarios', label: 'Usuarios y roles' },
    { id: 'reportes', label: 'Reportes' },
  ]

  const cambiosRecientes = [
    { campo: 'Umbral riesgo alto', valor: '70 → 75', fecha: '2024-02-14' },
    { campo: 'Modelo IA', valor: 'claude-sonnet-4-6', fecha: '2024-02-10' },
    { campo: 'Frecuencia SECOP', valor: '6h → 4h', fecha: '2024-02-05' },
  ]

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">Configuración</h1>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50">
              <RotateCcw className="w-4 h-4" /> Restaurar valores
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">
              <Save className="w-4 h-4" /> Guardar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard title="Parámetros activos" value={24} icon={Activity} />
          <KPICard title="Reglas de riesgo" value={12} icon={Shield} iconBg="bg-orange-50" iconColor="text-orange-500" />
          <KPICard title="Automatizaciones" value={6} icon={Brain} iconBg="bg-blue-50" iconColor="text-blue-500" />
          <KPICard title="Estado" value="Operativo" icon={CheckCircle} iconBg="bg-green-50" iconColor="text-green-500" />
        </div>

        <div className="flex border-b border-slate-200">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {activeTab === 'general' && (
            <>
              <Section title="1. Configuración general">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Nombre del sistema</label>
                    <input defaultValue="GobIA Auditor" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Ambiente</label>
                    <select className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white outline-none focus:border-blue-400">
                      <option>PRODUCCION</option><option>STAGING</option><option>DESARROLLO</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Idioma</label>
                    <select className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white outline-none focus:border-blue-400">
                      <option>Español</option><option>English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Zona horaria</label>
                    <select className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white outline-none focus:border-blue-400">
                      <option>America/Bogota</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <Toggle label="Notificaciones por email" defaultChecked />
                  <Toggle label="Notificaciones push" />
                </div>
              </Section>
              <Section title="2. Datos e integraciones">
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <Wifi className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-700">SECOP II conectado</p>
                    <p className="text-xs text-green-600">Última sincronización: hace 2 horas</p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Frecuencia de actualización</label>
                  <select className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white outline-none focus:border-blue-400">
                    <option>Cada 4 horas</option><option>Cada 6 horas</option><option>Diario</option>
                  </select>
                </div>
              </Section>
            </>
          )}
          {activeTab === 'riesgo' && (
            <Section title="3. Motor de riesgo">
              <div className="space-y-5">
                <Slider label="Peso anomalías textuales" defaultValue={30} />
                <Slider label="Peso concentración proveedor" defaultValue={25} />
                <Slider label="Peso urgencias injustificadas" defaultValue={20} />
                <Slider label="Peso fraccionamiento de contratos" defaultValue={15} />
                <Slider label="Peso historial proveedor" defaultValue={10} />
                <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Umbral crítico</label>
                    <input type="number" defaultValue={85} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Umbral alto</label>
                    <input type="number" defaultValue={70} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Umbral medio</label>
                    <input type="number" defaultValue={40} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-400" />
                  </div>
                </div>
              </div>
            </Section>
          )}
          {activeTab === 'ia' && (
            <Section title="4. IA y análisis">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Modelo principal</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white outline-none focus:border-blue-400">
                    <option>claude-sonnet-4-6</option><option>claude-opus-4-7</option><option>claude-haiku-4-5</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Modo análisis</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white outline-none focus:border-blue-400">
                    <option>Completo</option><option>Rápido</option><option>Focalizado</option>
                  </select>
                </div>
              </div>
              <Slider label="Confianza mínima requerida" defaultValue={80} />
              <Toggle label="Explicabilidad activa" defaultChecked />
              <Toggle label="Análisis automático al ingresar contratos" />
            </Section>
          )}
          {activeTab === 'alertas' && (
            <Section title="5. Alertas y notificaciones">
              <Toggle label="Alertas automáticas" defaultChecked />
              <Toggle label="Resumen diario por email" defaultChecked />
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Email de notificaciones</label>
                <input type="email" defaultValue="auditor@entidad.gov.co" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-400" />
              </div>
            </Section>
          )}
          {activeTab === 'usuarios' && (
            <Section title="6. Usuarios y permisos">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-slate-100">
                  <th className="text-left py-2 text-xs text-slate-500 font-semibold">Nombre</th>
                  <th className="text-left py-2 text-xs text-slate-500 font-semibold">Email</th>
                  <th className="text-left py-2 text-xs text-slate-500 font-semibold">Rol</th>
                  <th className="text-left py-2 text-xs text-slate-500 font-semibold">Estado</th>
                </tr></thead>
                <tbody>
                  {[{ nombre: 'Ana García', email: 'ana@entidad.gov.co', rol: 'ADMIN', activo: true }, { nombre: 'Carlos López', email: 'carlos@entidad.gov.co', rol: 'AUDITOR', activo: true }, { nombre: 'María Torres', email: 'maria@entidad.gov.co', rol: 'ANALISTA', activo: false }].map((u, i) => (
                    <tr key={i} className="border-b border-slate-50">
                      <td className="py-2.5 font-medium text-slate-700">{u.nombre}</td>
                      <td className="py-2.5 text-slate-500">{u.email}</td>
                      <td className="py-2.5"><span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{u.rol}</span></td>
                      <td className="py-2.5"><span className={`px-2 py-0.5 rounded text-xs ${u.activo ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{u.activo ? 'Activo' : 'Inactivo'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>
          )}
          {activeTab === 'reportes' && (
            <Section title="7. Configuración de reportes">
              <Toggle label="Generación automática mensual" defaultChecked />
              <Toggle label="Incluir análisis IA en reportes" defaultChecked />
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Formato por defecto</label>
                <select className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white outline-none focus:border-blue-400">
                  <option>PDF</option><option>XLSX</option><option>CSV</option>
                </select>
              </div>
            </Section>
          )}
        </div>
      </div>

      <aside className="w-72 shrink-0">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 sticky top-6">
          <h3 className="text-sm font-semibold text-slate-700">Resumen de configuración</h3>
          <ScoreCircle score={92} size="md" riskCategory="BAJO" showLabel={false} />
          <p className="text-center text-xs text-slate-500">Sistema listo</p>
          <div className="space-y-2">
            {[
              { icon: Wifi, label: 'SECOP II', val: 'Conectado', color: 'text-green-600' },
              { icon: Brain, label: 'Modelo IA', val: 'Activo', color: 'text-blue-600' },
              { icon: Shield, label: 'Reglas activas', val: '12', color: 'text-orange-600' },
              { icon: Bell, label: 'Alertas activas', val: '12', color: 'text-red-600' },
              { icon: Users, label: 'Usuarios activos', val: '3', color: 'text-slate-600' },
              { icon: Database, label: 'Respaldo', val: 'OK', color: 'text-green-600' },
            ].map(({ icon: Icon, label, val, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                  {label}
                </div>
                <span className={`text-xs font-semibold ${color}`}>{val}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Cambios recientes</p>
            <div className="space-y-1.5">
              {cambiosRecientes.map((c, i) => (
                <div key={i} className="text-xs text-slate-500">
                  <p className="font-medium text-slate-600">{c.campo}</p>
                  <p>{c.valor} — {c.fecha}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <button className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 text-white text-xs rounded-lg font-medium hover:bg-blue-700">
              <Save className="w-3.5 h-3.5" /> Guardar configuración
            </button>
            <button className="w-full flex items-center justify-center gap-2 py-2 border border-slate-200 text-slate-600 text-xs rounded-lg font-medium hover:bg-slate-50">
              <Download className="w-3.5 h-3.5" /> Exportar configuración
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}

