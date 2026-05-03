import React, { useMemo } from 'react';
import { AlertTriangle, CheckCircle2, ClipboardList, Shirt, Stethoscope } from 'lucide-react';
import { Inscricao } from '../types';

export type DashboardFilter = 'all' | 'confirmed' | 'notConfirmed' | 'pending' | 'healthPending' | 'missingShirt';

interface VisitDashboardProps {
  inscricoes: Inscricao[];
  activeFilter: DashboardFilter;
  onFilterChange: (filter: DashboardFilter) => void;
}

function isFilled(value: unknown): boolean {
  return String(value ?? '').trim().length > 0;
}

export function hasHealthPending(item: Inscricao): boolean {
  if (!isFilled(item.alergico) || !isFilled(item.restricaoMedicamentosa)) return true;
  if (item.alergico === 'SIM' && !isFilled(item.tipoAlergia)) return true;
  if (item.restricaoMedicamentosa === 'SIM' && !isFilled(item.tipoRestricaoMedicamentosa)) return true;
  return false;
}

export function hasMissingShirt(item: Inscricao): boolean {
  return !isFilled(item.tamanhoCamisa);
}

function StatCard({
  icon,
  label,
  value,
  accentClass,
  isActive,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accentClass: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border bg-white p-4 text-left shadow-sm transition ${
        isActive ? 'border-[var(--color-brand-dark)] ring-2 ring-[var(--color-brand-dark)]/20' : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`grid h-10 w-10 place-items-center rounded-lg ${accentClass}`}>{icon}</div>
      </div>
    </button>
  );
}

export function VisitDashboard({ inscricoes, activeFilter, onFilterChange }: VisitDashboardProps) {
  const metrics = useMemo(() => {
    const confirmed = inscricoes.filter((item) => item.status === 'Confirmado');
    const notConfirmed = inscricoes.filter((item) => item.status === 'Nao confirmado');
    const pending = inscricoes.filter((item) => item.status === 'Pendente');
    const healthPending = inscricoes.filter(hasHealthPending);
    const missingShirt = inscricoes.filter(hasMissingShirt);
    const attention = inscricoes.filter((item) => hasHealthPending(item) || hasMissingShirt(item));

    return {
      confirmed,
      notConfirmed,
      pending,
      healthPending,
      missingShirt,
      attention,
    };
  }, [inscricoes]);

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          icon={<ClipboardList size={18} className="text-slate-700" />}
          label="Total de registros"
          value={inscricoes.length}
          accentClass="bg-slate-100"
          isActive={activeFilter === 'all'}
          onClick={() => onFilterChange('all')}
        />
        <StatCard
          icon={<CheckCircle2 size={18} className="text-emerald-700" />}
          label="Registros confirmados"
          value={metrics.confirmed.length}
          accentClass="bg-emerald-100"
          isActive={activeFilter === 'confirmed'}
          onClick={() => onFilterChange('confirmed')}
        />
        <StatCard
          icon={<AlertTriangle size={18} className="text-amber-700" />}
          label="Nao confirmados"
          value={metrics.notConfirmed.length}
          accentClass="bg-amber-100"
          isActive={activeFilter === 'notConfirmed'}
          onClick={() => onFilterChange('notConfirmed')}
        />
        <StatCard
          icon={<AlertTriangle size={18} className="text-orange-700" />}
          label="Pendentes"
          value={metrics.pending.length}
          accentClass="bg-orange-100"
          isActive={activeFilter === 'pending'}
          onClick={() => onFilterChange('pending')}
        />
        <StatCard
          icon={<Stethoscope size={18} className="text-rose-700" />}
          label="Pendencia de saude"
          value={metrics.healthPending.length}
          accentClass="bg-rose-100"
          isActive={activeFilter === 'healthPending'}
          onClick={() => onFilterChange('healthPending')}
        />
        <StatCard
          icon={<Shirt size={18} className="text-indigo-700" />}
          label="Sem tamanho de camisa"
          value={metrics.missingShirt.length}
          accentClass="bg-indigo-100"
          isActive={activeFilter === 'missingShirt'}
          onClick={() => onFilterChange('missingShirt')}
        />
      </div>

      <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-800">Registros que precisam de atencao</h2>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            {metrics.attention.length} com pendencia
          </span>
        </div>

        {metrics.attention.length === 0 ? (
          <p className="text-sm text-emerald-700">Nenhuma pendencia identificada.</p>
        ) : (
          <div className="max-h-56 space-y-2 overflow-auto pr-1">
            {metrics.attention.map((item) => {
              const issues: string[] = [];
              if (hasHealthPending(item)) issues.push('Saude incompleta');
              if (!isFilled(item.tamanhoCamisa)) issues.push('Sem camisa');

              return (
                <div
                  key={item.rowIndex}
                  className="flex flex-col gap-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-800">
                      #{item.rowIndex} - {item.nome || 'Nome nao informado'}
                    </p>
                    <p className="truncate text-xs text-slate-600">{item.localidade || 'Bairro nao informado'}</p>
                  </div>
                  <p className="text-xs font-semibold text-amber-800">{issues.join(' | ')}</p>
                </div>
              );
            })}
          </div>
        )}
      </article>
    </section>
  );
}
