import { Navigate, Route, Routes } from 'react-router-dom';
import MapaRelacionesPage from './pages/MapaRelacionesPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard/mapa-de-relaciones" replace />} />
      <Route path="/dashboard/mapa-de-relaciones" element={<MapaRelacionesPage />} />
      <Route path="*" element={<Navigate to="/dashboard/mapa-de-relaciones" replace />} />
    </Routes>
  );
}
