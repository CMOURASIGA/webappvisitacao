import React, { useMemo, useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { StatusBar } from './components/StatusBar';
import { DashboardFilter, hasHealthPending, hasMissingShirt, VisitDashboard } from './components/VisitDashboard';
import { Inscricao } from './types';
import { useInscricoes } from './hooks/useInscricoes';

function getFilterLabel(filter: DashboardFilter): string {
  if (filter === 'confirmed') return 'registros confirmados';
  if (filter === 'notConfirmed') return 'registros nao confirmados';
  if (filter === 'healthPending') return 'registros com pendencia de saude';
  if (filter === 'missingShirt') return 'registros sem tamanho de camisa';
  return 'todos os registros';
}

function filterInscricoes(inscricoes: Inscricao[], filter: DashboardFilter): Inscricao[] {
  if (filter === 'confirmed') return inscricoes.filter((item) => item.status === 'Confirmado');
  if (filter === 'notConfirmed') return inscricoes.filter((item) => item.status === 'Nao confirmado');
  if (filter === 'healthPending') return inscricoes.filter(hasHealthPending);
  if (filter === 'missingShirt') return inscricoes.filter(hasMissingShirt);
  return inscricoes;
}

function getHealthLabel(item: Inscricao): string {
  if (hasHealthPending(item)) return 'Pendente';
  return 'Completa';
}

export default function DashboardPage() {
  const { inscricoes, isLoading, error, refresh } = useInscricoes();
  const [activeFilter, setActiveFilter] = useState<DashboardFilter>('all');
  const filteredInscricoes = useMemo(
    () => filterInscricoes(inscricoes, activeFilter),
    [inscricoes, activeFilter],
  );

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
            <VisitDashboard inscricoes={inscricoes} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            <StatusBar inscricoes={inscricoes} />

            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-slate-800">
                  Resultado do filtro: {getFilterLabel(activeFilter)}
                </h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {filteredInscricoes.length} registros
                </span>
              </div>

              {filteredInscricoes.length === 0 ? (
                <p className="text-sm text-slate-600">Nenhum registro encontrado para este filtro.</p>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredInscricoes.map((item) => (
                    <article key={item.rowIndex} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-slate-900">#{item.rowIndex} - {item.nome || 'Nome nao informado'}</p>
                        <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-800">
                          {item.status || 'Nao informado'}
                        </span>
                      </div>

                      <div className="mt-2 grid grid-cols-1 gap-1 text-sm text-slate-700">
                        <p><strong className="font-semibold">Telefone:</strong> {item.telefone || item.celular || 'Nao informado'}</p>
                        <p><strong className="font-semibold">Bairro:</strong> {item.localidade || 'Nao informado'}</p>
                        <p><strong className="font-semibold">Camisa:</strong> {item.tamanhoCamisa || 'Nao informado'}</p>
                        <p><strong className="font-semibold">Saude:</strong> {getHealthLabel(item)}</p>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {hasHealthPending(item) && (
                          <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">
                            Pendencia saude
                          </span>
                        )}
                        {hasMissingShirt(item) && (
                          <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                            Sem camisa
                          </span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
