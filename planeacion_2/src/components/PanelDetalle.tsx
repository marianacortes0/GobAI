import { useState } from 'react';
import { X, AlertTriangle, FileText, Users, Building2, Triangle, Star, Network } from 'lucide-react';
import type { GrafoData, NodoGrafo, TipoNodo } from '@/types';
import { formatCOP, formatFecha, formatNumero } from '@/lib/format';

interface Props {
  nodo: NodoGrafo | null;
  contexto?: GrafoData;
  onClose: () => void;
}

const TABS = ['Información', 'Alertas', 'Conexiones'] as const;
type Tab = typeof TABS[number];

const ICONOS: Record<TipoNodo, JSX.Element> = {
  entidad: <Building2 className="h-4 w-4" />,
  proveedor: <Building2 className="h-4 w-4" />,
  contrato: <FileText className="h-4 w-4" />,
  persona: <Users className="h-4 w-4" />,
  consorcio: <Network className="h-4 w-4" />,
  sancion: <Triangle className="h-4 w-4" />,
  pep: <Star className="h-4 w-4" />,
};

export default function PanelDetalle({ nodo, contexto, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('Información');
  if (!nodo) return null;

  const conexiones = contexto?.aristas.filter((a) => a.source === nodo.id || a.target === nodo.id) ?? [];
  const otrosNodos = (id: string) => contexto?.nodos.find((n) => n.id === id);

  return (
    <aside className="absolute right-0 top-0 z-30 flex h-full w-96 flex-col border-l border-slate-700 bg-slate-900/95 shadow-2xl backdrop-blur">
      <div className="flex items-start justify-between gap-3 border-b border-slate-800 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-slate-800 p-2 text-slate-300">{ICONOS[nodo.tipo]}</div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{nodo.tipo}</p>
            <h2 className="text-base font-semibold text-slate-100">{nodo.label}</h2>
            {nodo.nivel_riesgo && (
              <span
                className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  nodo.nivel_riesgo === 'alto'
                    ? 'bg-red-500/15 text-red-300'
                    : nodo.nivel_riesgo === 'medio'
                    ? 'bg-amber-500/15 text-amber-300'
                    : 'bg-emerald-500/15 text-emerald-300'
                }`}
              >
                {nodo.nivel_riesgo === 'alto' && <AlertTriangle className="h-3 w-3" />}
                Riesgo {nodo.nivel_riesgo}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          aria-label="Cerrar panel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex border-b border-slate-800 px-3">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2.5 text-xs font-medium transition ${
              tab === t
                ? 'border-b-2 border-blue-500 text-slate-100'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      <div className="flex-1 overflow-y-auto px-5 py-4 text-sm text-slate-300">
        {tab === 'Información' && <Informacion nodo={nodo} />}
        {tab === 'Alertas' && <Alertas nodo={nodo} contexto={contexto} />}
        {tab === 'Conexiones' && (
          <Conexiones
            conexiones={conexiones.map((c) => {
              const otroId = c.source === nodo.id ? c.target : c.source;
              return { tipo: c.tipo, nodo: otrosNodos(otroId), direccion: c.source === nodo.id ? 'out' : 'in' as const };
            })}
          />
        )}
      </div>
    </aside>
  );
}

function Informacion({ nodo }: { nodo: NodoGrafo }) {
  const meta = nodo.metadata ?? {};
  const filas: Array<[string, string]> = [];
  if (meta.nit) filas.push(['NIT', meta.nit]);
  if (meta.cedula) filas.push(['Cédula', meta.cedula]);
  if (meta.ciudad) filas.push(['Ciudad', meta.ciudad]);
  if (meta.sector) filas.push(['Sector', meta.sector]);
  if (meta.rol) filas.push(['Rol', meta.rol]);
  if (meta.objeto) filas.push(['Objeto', meta.objeto]);
  if (meta.fecha) filas.push(['Fecha', formatFecha(meta.fecha)]);
  if (meta.valor !== undefined) filas.push(['Valor del contrato', formatCOP(meta.valor)]);
  if (meta.valor_total !== undefined) filas.push(['Valor adjudicado total', formatCOP(meta.valor_total)]);
  if (meta.monto !== undefined) filas.push(['Monto sanción', formatCOP(meta.monto)]);
  if (meta.fuente) filas.push(['Fuente', meta.fuente]);

  if (filas.length === 0) {
    return <p className="text-slate-500">Sin metadata adicional para este nodo.</p>;
  }

  return (
    <dl className="space-y-3">
      {filas.map(([k, v]) => (
        <div key={k} className="flex items-start justify-between gap-3 border-b border-slate-800/70 pb-2 last:border-0">
          <dt className="text-xs uppercase tracking-wide text-slate-500">{k}</dt>
          <dd className="max-w-[60%] text-right text-slate-200">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Alertas({ nodo, contexto }: { nodo: NodoGrafo; contexto?: GrafoData }) {
  const alertasRelacionadas =
    contexto?.aristas
      .filter((a) => (a.source === nodo.id || a.target === nodo.id) && (a.tipo === 'sancionado' || a.tipo === 'alerta'))
      .map((a) => contexto.nodos.find((n) => n.id === (a.source === nodo.id ? a.target : a.source)))
      .filter(Boolean) ?? [];

  if (alertasRelacionadas.length === 0 && nodo.nivel_riesgo !== 'alto') {
    return <p className="text-slate-500">No hay alertas activas para este nodo.</p>;
  }

  return (
    <ul className="space-y-2">
      {nodo.nivel_riesgo === 'alto' && (
        <li className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Este nodo está marcado con <strong>nivel de riesgo alto</strong>.</span>
        </li>
      )}
      {alertasRelacionadas.map((a) =>
        a ? (
          <li key={a.id} className="rounded-lg border border-slate-700/60 bg-slate-800/40 p-3 text-xs">
            <p className="font-semibold text-slate-100">{a.label}</p>
            <p className="text-slate-400">
              {a.tipo === 'sancion' && a.metadata?.monto !== undefined
                ? `Monto: ${formatCOP(a.metadata.monto)} · ${formatFecha(a.metadata.fecha)}`
                : a.metadata?.fuente
                ? `Fuente: ${a.metadata.fuente}`
                : 'Alerta vinculada'}
            </p>
          </li>
        ) : null,
      )}
    </ul>
  );
}

function Conexiones({
  conexiones,
}: {
  conexiones: Array<{ tipo: string; nodo?: NodoGrafo; direccion: 'in' | 'out' }>;
}) {
  if (conexiones.length === 0) return <p className="text-slate-500">Este nodo no tiene conexiones visibles.</p>;
  return (
    <>
      <p className="mb-2 text-xs text-slate-500">{formatNumero(conexiones.length)} conexiones</p>
      <ul className="space-y-1.5">
        {conexiones.map((c, i) =>
          c.nodo ? (
            <li
              key={i}
              className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-800/40 px-3 py-2 text-xs"
            >
              <div>
                <p className="font-medium text-slate-100">{c.nodo.label}</p>
                <p className="text-[10px] uppercase tracking-wide text-slate-500">{c.nodo.tipo}</p>
              </div>
              <span className="rounded bg-slate-900/70 px-2 py-0.5 text-[10px] text-slate-400">
                {c.direccion === 'out' ? '→' : '←'} {c.tipo}
              </span>
            </li>
          ) : null,
        )}
      </ul>
    </>
  );
}
