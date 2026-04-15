import React, { useState, useMemo } from 'react';
import { Search, X, Loader2, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { Inscricao, UpdateInscricaoData } from './types';
import { Card } from './components/Card';
import { Modal } from './components/Modal';
import { ViewDetails } from './components/ViewDetails';
import { EditForm } from './components/EditForm';

export default function App() {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [selectedInscricao, setSelectedInscricao] = useState<Inscricao | null>(null);
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchInscricoes = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/inscricoes?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Falha ao carregar dados');
      const data = await response.json();
      setInscricoes(data);
      setHasSearched(true);
    } catch (err) {
      setError('Não foi possível carregar as inscrições. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      showToast('Digite algo para pesquisar', 'error');
      return;
    }
    fetchInscricoes(searchTerm.trim());
  };

  const handleClear = () => {
    setSearchTerm('');
    setHasSearched(false);
    setInscricoes([]);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdate = async (data: UpdateInscricaoData) => {
    if (!selectedInscricao) return;

    try {
      const response = await fetch(`/api/inscricoes/${selectedInscricao.rowIndex}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Falha ao salvar');

      // Update local state
      setInscricoes(prev => prev.map(item => 
        item.rowIndex === selectedInscricao.rowIndex 
          ? { ...item, ...data }
          : item
      ));

      setEditModalOpen(false);
      showToast('Dados atualizados com sucesso!', 'success');
    } catch (err) {
      throw err; // Let the form handle the error display
    }
  };

  const handleView = (inscricao: Inscricao) => {
    setSelectedInscricao(inscricao);
    setViewModalOpen(true);
  };

  const handleEdit = (inscricao: Inscricao) => {
    setSelectedInscricao(inscricao);
    setEditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-20 flex flex-col">
      {/* Header */}
      <header className="bg-white px-6 py-3 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 min-h-[72px] gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <img 
            src="https://i.imgur.com/c5XQ7TW.jpeg" 
            alt="Logo EAC" 
            className="h-10 w-auto"
            referrerPolicy="no-referrer"
          />
          <h1 className="text-[18px] font-bold tracking-tight text-slate-800">Inscrições Prioritárias</h1>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2 w-full md:w-[500px]">
          <input
            type="text"
            className="flex-grow px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-sm focus:outline-none focus:border-blue-600"
            placeholder="Buscar por nome, data ou localidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="px-5 py-2.5 rounded-lg font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors">Pesquisar</button>
          <button onClick={handleClear} className="px-5 py-2.5 rounded-lg font-semibold text-sm bg-transparent border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">Limpar</button>
          <button onClick={() => setHelpModalOpen(true)} className="px-3 py-2.5 rounded-lg font-semibold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors flex items-center justify-center" title="Ajuda">
            <HelpCircle size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6">
        <div className="max-w-[1200px] mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin mb-4 text-blue-600" />
              <p>Buscando registros...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md mx-auto mt-10">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-red-800 mb-2">Ops! Algo deu errado.</h3>
              <p className="text-red-600 text-sm mb-4">{error}</p>
              <button 
                onClick={handleSearch}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
              >
                Tentar novamente
              </button>
            </div>
          ) : !hasSearched ? (
            <div className="flex flex-col items-center justify-center py-32 text-center max-w-lg mx-auto">
              <Search className="h-16 w-16 text-slate-300 mb-6" />
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Encontre um Registro</h2>
              <p className="text-slate-500 mb-8">
                Para validar ou fazer a manutenção de um registro, você precisa pesquisá-lo primeiro. Digite o nome, localidade ou data na barra de busca acima.
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-[20px] font-bold text-slate-800">Registros Localizados ({inscricoes.length})</h2>
                <span className="text-[13px] text-slate-500">Sincronizado com Google Sheets</span>
              </div>

              {inscricoes.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
                  <p className="text-slate-500">Nenhum registro encontrado para a busca "{searchTerm}".</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {inscricoes.map((inscricao) => (
                    <Card 
                      key={inscricao.rowIndex} 
                      inscricao={inscricao} 
                      onView={handleView}
                      onEdit={handleEdit}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modals */}
      <Modal 
        isOpen={viewModalOpen} 
        onClose={() => setViewModalOpen(false)} 
        title="Detalhes da Inscrição"
      >
        {selectedInscricao && <ViewDetails inscricao={selectedInscricao} />}
      </Modal>

      <Modal 
        isOpen={editModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        title="Editar Registro"
      >
        {selectedInscricao && (
          <EditForm 
            inscricao={selectedInscricao} 
            onSubmit={handleUpdate}
            onCancel={() => setEditModalOpen(false)}
          />
        )}
      </Modal>

      <Modal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
        title="Como o sistema funciona"
      >
        <div className="space-y-4 text-[14px] text-slate-700 leading-relaxed">
          <p>
            Bem-vindo ao sistema de Gestão de Inscrições Prioritárias. Este sistema foi desenhado para ser rápido e seguro.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <Search size={16} /> 1. Pesquisa Obrigatória
            </h4>
            <p className="text-blue-800">
              O sistema não carrega todos os registros de uma vez para evitar lentidão e erros. Você deve <strong>sempre pesquisar</strong> pelo nome, localidade ou data do participante antes de fazer qualquer manutenção.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-2">2. Edição de Registros</h4>
            <p>
              Ao clicar no ícone de lápis em um card, você poderá editar <strong>todos os dados</strong> do participante, incluindo os dados originais (Nome, Idade, Localidade) e os dados complementares (Camisa, Alergia, Nome Social).
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-2">3. Status de Confirmação</h4>
            <p>
              Você pode alterar o status do participante para "Confirmado" durante a edição. Isso atualizará a planilha e o card passará a exibir um ícone verde de confirmação, sinalizando para toda a equipe que a participação está garantida.
            </p>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
            <h4 className="font-bold text-amber-900 mb-2">4. Campos Obrigatórios</h4>
            <p className="text-amber-800">
              Para garantir a qualidade dos dados, sempre que você editar um registro, será obrigatório preencher o Tamanho da Camisa, se é Alérgico, o Tipo de Alergia e o Nome Social.
            </p>
          </div>
        </div>
      </Modal>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
