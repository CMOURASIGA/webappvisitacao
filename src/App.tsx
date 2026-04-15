import React, { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Search, X } from 'lucide-react';
import { EditForm } from './components/EditForm';
import { Card } from './components/Card';
import { Modal } from './components/Modal';
import { StatusBar } from './components/StatusBar';
import { ViewDetails } from './components/ViewDetails';
import { updateInscricao } from './api/sheets';
import { useInscricoes } from './hooks/useInscricoes';
import { Inscricao, UpdateInscricaoData } from './types';

function normalizeText(value: string): string {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export default function App() {
  const { inscricoes, setInscricoes, isLoading, error, refresh } = useInscricoes();

  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInscricao, setSelectedInscricao] = useState<Inscricao | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const filteredInscricoes = useMemo(() => {
    const query = normalizeText(searchTerm);

    const filtered = inscricoes.filter((item) => {
      if (!query) return true;
      const fields = [item.nome, item.email, item.telefone].map(normalizeText);
      return fields.some((field) => field.includes(query));
    });

    return [...filtered].sort((a, b) =>
      String(a.nome || '').localeCompare(String(b.nome || ''), 'pt-BR', { sensitivity: 'base' }),
    );
  }, [inscricoes, searchTerm]);

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  }

  async function handleUpdate(data: UpdateInscricaoData) {
    if (!selectedInscricao) return;

    await updateInscricao(selectedInscricao.rowIndex, data);

    setInscricoes((prev) =>
      prev.map((item) =>
        item.rowIndex === selectedInscricao.rowIndex ? { ...item, ...data } : item,
      ),
    );

    setSelectedInscricao((prev) => (prev ? { ...prev, ...data } : prev));
    setEditModalOpen(false);
    showToast('Dados atualizados com sucesso!', 'success');
  }

  function handleView(inscricao: Inscricao) {
    setSelectedInscricao(inscricao);
    setViewModalOpen(true);
  }

  function handleEdit(inscricao: Inscricao) {
    setSelectedInscricao(inscricao);
    setEditModalOpen(true);
  }

  function handleSearch() {
    setSearchTerm(searchInput.trim());
  }

  function handleClearSearch() {
    setSearchInput('');
    setSearchTerm('');
  }

  function handleSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }

  return (
    <div className="min-h-screen bg-[var(--page-bg)] pb-20 text-slate-800">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 flex items-center gap-3">
              <img src="https://i.imgur.com/c5XQ7TW.jpeg" alt="Logo EAC" className="h-10 w-auto rounded" referrerPolicy="no-referrer" />
              <h1 className="truncate text-lg font-bold text-[var(--color-brand-dark)]">Inscricoes Prioritarias</h1>
            </div>

            <div className="flex w-full items-center gap-2 lg:w-[560px]">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, e-mail ou telefone"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-dark)]/20"
                />
              </div>

              <button
                type="button"
                onClick={handleSearch}
                className="h-11 rounded-lg bg-[var(--color-brand-accent)] px-4 text-sm font-semibold text-slate-900 hover:brightness-95"
              >
                Pesquisar
              </button>

              <button
                type="button"
                onClick={handleClearSearch}
                className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-slate-600 hover:bg-slate-50"
                aria-label="Limpar busca"
              >
                <X size={18} />
              </button>
            </div>
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
            <button type="button" onClick={refresh} className="h-10 rounded-lg bg-rose-600 px-4 text-sm font-medium text-white hover:bg-rose-700">
              Tentar novamente
            </button>
          </div>
        ) : (
          <>
            <StatusBar inscricoes={filteredInscricoes} />

            {filteredInscricoes.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white py-20 text-center text-slate-500">
                Nenhum registro encontrado{searchTerm ? ` para "${searchTerm}".` : '.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredInscricoes.map((inscricao) => (
                  <Card key={inscricao.rowIndex} inscricao={inscricao} onView={handleView} onEdit={handleEdit} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Detalhes da inscricao">
        {selectedInscricao && <ViewDetails inscricao={selectedInscricao} />}
      </Modal>

      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Editar registro">
        {selectedInscricao && <EditForm inscricao={selectedInscricao} onSubmit={handleUpdate} onCancel={() => setEditModalOpen(false)} />}
      </Modal>

      {toast && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
          <div className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-lg ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
            {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
