import MapaContainer from '@/components/MapaContainer';
import { Bell, Search, Settings } from 'lucide-react';

export default function MapaRelacionesPage() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-900 text-slate-100">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <MapaContainer />
      </main>
    </div>
  );
}

function Sidebar() {
  const items = [
    { label: 'Inicio', activo: false },
    { label: 'Contratos', activo: false },
    { label: 'Proveedores', activo: false },
    { label: 'Personas', activo: false },
    { label: 'Mapa de relaciones', activo: true },
    { label: 'Reportes', activo: false },
    { label: 'Auditoría', activo: false },
    { label: 'Alertas', activo: false, badge: 8 },
    { label: 'Configuración', activo: false },
  ];
  return (
    <aside className="hidden w-56 flex-col border-r border-slate-800 bg-slate-950/60 px-4 py-5 lg:flex">
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500" />
        <span className="text-sm font-semibold tracking-wide">GobIA</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 text-sm">
        {items.map((it) => (
          <button
            key={it.label}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-left transition ${
              it.activo
                ? 'bg-blue-500/15 text-blue-300'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
            }`}
          >
            <span>{it.label}</span>
            {it.badge ? (
              <span className="rounded-full bg-red-500/90 px-2 py-0.5 text-[10px] font-bold text-white">
                {it.badge}
              </span>
            ) : null}
          </button>
        ))}
      </nav>
      <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-400">
        <p className="font-semibold text-slate-200">Procesando datos</p>
        <p className="mt-1">SECOP II + RUES + UIAF</p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div className="shimmer h-full w-2/3 rounded-full" />
        </div>
      </div>
    </aside>
  );
}

function TopBar() {
  return (
    <header className="flex h-14 items-center gap-3 border-b border-slate-800 bg-slate-900/70 px-6">
      <div className="relative flex flex-1 items-center">
        <Search className="absolute left-3 h-4 w-4 text-slate-500" />
        <input
          type="search"
          placeholder="Buscar contratos, proveedores, personas, sanciones…"
          className="w-full max-w-xl rounded-lg border border-slate-700 bg-slate-800/70 py-2 pl-9 pr-3 text-sm placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
        />
      </div>
      <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100">
        <Bell className="h-4 w-4" />
      </button>
      <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100">
        <Settings className="h-4 w-4" />
      </button>
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500" />
    </header>
  );
}
