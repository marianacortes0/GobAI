import { useState } from 'react'

export type TabId = 'general' | 'riesgo' | 'ia' | 'alertas' | 'reportes'

const tabs: { id: TabId; label: string; sectionId: string }[] = [
  { id: 'general', label: 'General', sectionId: 'section-general' },
  { id: 'riesgo', label: 'Motor de riesgo', sectionId: 'section-riesgo' },
  { id: 'ia', label: 'IA y análisis', sectionId: 'section-ia' },
  { id: 'alertas', label: 'Alertas', sectionId: 'section-alertas' },
  { id: 'reportes', label: 'Reportes', sectionId: 'section-respaldo' },
]

export function ConfigTabs() {
  const [activeTab, setActiveTab] = useState<TabId>('general')

  function handleClick(tab: (typeof tabs)[number]) {
    setActiveTab(tab.id)
    document.getElementById(tab.sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="flex border-b border-slate-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleClick(tab)}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
