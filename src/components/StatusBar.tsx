import React from 'react';
import { Inscricao } from '../types';

interface StatusBarProps {
  inscricoes: Inscricao[];
}

function isConfirmed(status: string): boolean {
  return status === 'Confirmado' || status === 'Ativo';
}

export function StatusBar({ inscricoes }: StatusBarProps) {
  const confirmed = inscricoes.filter((item) => isConfirmed(item.status)).length;
  const pending = inscricoes.filter((item) => item.status === 'Pendente').length;
  const cancelled = inscricoes.filter((item) => item.status === 'Cancelado').length;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 flex flex-wrap items-center gap-x-6 gap-y-2">
      <span className="inline-flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-confirmed)]" />
        Confirmados: {confirmed}
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-pending)]" />
        Pendentes: {pending}
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-cancelled)]" />
        Cancelados: {cancelled}
      </span>
      <span className="ml-auto font-semibold text-slate-900">{inscricoes.length} registros</span>
    </div>
  );
}
