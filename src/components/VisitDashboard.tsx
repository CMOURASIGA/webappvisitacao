import React, { useMemo } from 'react';
import { AlertTriangle, CheckCircle2, ClipboardList, Shirt, Stethoscope } from 'lucide-react';
import { Inscricao } from '../types';

interface VisitDashboardProps {
  inscricoes: Inscricao[];
}

function isFilled(value: unknown): boolean {
  return String(value ?? '').trim().length > 0;
}

function hasHealthPending(item: Inscricao): boolean {
  if (!isFilled(item.alergico) || !isFilled(item.restricaoMedicamentosa)) return true;
  if (item.alergico === 'SIM' && !isFilled(item.tipoAlergia)) return true;
  if (item.restricaoMedicamentosa === 'SIM' && !isFilled(item.tipoRestricaoMedicamentosa)) return true;
  return false;
}

function hasFollowUpEdition(item: Inscricao): boolean {
  const followUpFields = [
    item.tamanhoCamisa,
    item.alergico,
    item.tipoAlergia,
    item.restricaoMedicamentosa,
    item.tipoRestricaoMedicamentosa,
    item.visitadoTioVisitacao,
    item.valorContribuicao,
    item.desistiu,
    item.motivoEncontro,
  ];

  return followUpFields.some(isFilled);
}

function StatCard({
  icon,
  label,
  value,
  accentClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accentClass: string;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`grid h-10 w-10 place-items-center rounded-lg ${accentClass}`}>{icon}</div>
      </div>
    </article>
  );
}

export function VisitDashboard({ inscricoes }: VisitDashboardProps) {
  const metrics = useMemo(() => {
    const edited = inscricoes.filter(hasFollowUpEdition);
    const notEdited = inscricoes.filter((item) => !hasFollowUpEdition(item));
    const healthPending = inscricoes.filter(hasHealthPending);
    const missingShirt = inscricoes.filter((item) => !isFilled(item.tamanhoCamisa));
    const attention = inscricoes.filter((item) => hasHealthPending(item) || !isFilled(item.tamanhoCamisa));

    return {
      edited,
      notEdited,
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
        />
        <StatCard
          icon={<CheckCircle2 size={18} className="text-emerald-700" />}
          label="Registros editados"
          value={metrics.edited.length}
          accentClass="bg-emerald-100"
        />
        <StatCard
          icon={<AlertTriangle size={18} className="text-amber-700" />}
          label="Sem edicao"
          value={metrics.notEdited.length}
          accentClass="bg-amber-100"
        />
        <StatCard
          icon={<Stethoscope size={18} className="text-rose-700" />}
          label="Pendencia de saude"
          value={metrics.healthPending.length}
          accentClass="bg-rose-100"
        />
        <StatCard
          icon={<Shirt size={18} className="text-indigo-700" />}
          label="Sem tamanho de camisa"
          value={metrics.missingShirt.length}
          accentClass="bg-indigo-100"
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
