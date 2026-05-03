import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { StatusBar } from './components/StatusBar';
import { VisitDashboard } from './components/VisitDashboard';
import { useInscricoes } from './hooks/useInscricoes';

export default function DashboardPage() {
  const { inscricoes, isLoading, error, refresh } = useInscricoes();

  return (
    <div className="min-h-screen bg-[var(--page-bg)] pb-10 text-slate-800">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4">
          <div>
            <h1 className="text-xl font-bold text-[var(--color-brand-dark)]">Dashboard de Visitas</h1>
            <p className="text-sm text-slate-500">Acompanhamento geral dos registros visitados</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-4 px-4 py-5">
        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white py-20 text-center text-slate-600">
            <Loader2 size={24} className="mx-auto mb-3 animate-spin text-[var(--color-brand-dark)]" />
            Buscando registros...
          </div>
        ) : error ? (
          <div className="mx-auto max-w-xl rounded-xl border border-rose-200 bg-rose-50 p-6 text-center">
            <AlertCircle size={28} className="mx-auto mb-2 text-rose-600" />
            <p className="mb-4 text-sm text-rose-700">{error}</p>
            <button
              type="button"
              onClick={refresh}
              className="h-10 rounded-lg bg-rose-600 px-4 text-sm font-medium text-white hover:bg-rose-700"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <>
            <VisitDashboard inscricoes={inscricoes} />
            <StatusBar inscricoes={inscricoes} />
          </>
        )}
      </main>
    </div>
  );
}
