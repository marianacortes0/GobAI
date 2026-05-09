import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { DashboardPage } from '@/pages/DashboardPage'
import { ContratosPage } from '@/pages/ContratosPage'
import { AlertasPage } from '@/pages/AlertasPage'
import { AnalisisIAPage } from '@/pages/AnalisisIAPage'
import { MapaRelacionesPage } from '@/pages/MapaRelacionesPage'
import { ReportesPage } from '@/pages/ReportesPage'
import { ConfiguracionPage } from '@/pages/ConfiguracionPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/contratos" element={<ContratosPage />} />
          <Route path="/contratos/:id" element={<ContratosPage />} />
          <Route path="/analisis/:id" element={<AnalisisIAPage />} />
          <Route path="/analisis/nuevo" element={<AnalisisIAPage />} />
          <Route path="/alertas" element={<AlertasPage />} />
          <Route path="/alertas/:id" element={<AlertasPage />} />
          <Route path="/mapa-relaciones" element={<MapaRelacionesPage />} />
          <Route path="/reportes" element={<ReportesPage />} />
          <Route path="/reportes/:id" element={<ReportesPage />} />
          <Route path="/configuracion" element={<ConfiguracionPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
