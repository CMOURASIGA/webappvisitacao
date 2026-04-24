import React, { useState } from 'react';
import { Inscricao, UpdateInscricaoData } from '../types';

interface EditFormProps {
  inscricao: Inscricao;
  onSubmit: (data: UpdateInscricaoData, options: { notifyResponsavel: boolean }) => Promise<void>;
  onCancel: () => void;
}

function formatDateBR(value: string): string {
  if (!value) return '';

  const text = String(value).trim();

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(text)) return text;

  const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`;

  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return text;

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());

  return `${day}/${month}/${year}`;
}

function toDateInputValue(value: string): string {
  if (!value) return '';

  const text = String(value).trim();

  const brMatch = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (brMatch) return `${brMatch[3]}-${brMatch[2]}-${brMatch[1]}`;

  const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;

  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return '';

  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function fromDateInputValue(value: string): string {
  if (!value) return '';
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return value;
  return `${match[3]}/${match[2]}/${match[1]}`;
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-sm font-medium text-slate-700">{children}</label>;
}

function YesNoSelect({
  value,
  onChange,
}: {
  value: '' | 'SIM' | 'NAO';
  onChange: (next: '' | 'SIM' | 'NAO') => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as '' | 'SIM' | 'NAO')}
      className="h-11 w-full rounded-lg border border-slate-300 px-3"
    >
      <option value="">Selecione</option>
      <option value="SIM">SIM</option>
      <option value="NAO">NÃO</option>
    </select>
  );
}

export function EditForm({ inscricao, onSubmit, onCancel }: EditFormProps) {
  const [form, setForm] = useState<UpdateInscricaoData>({
    nome: inscricao.nome || '',
    email: inscricao.email || '',
    status: inscricao.status || '',
    localidade: inscricao.localidade || '',
    telefone: inscricao.telefone || '',
    dataNascimento: formatDateBR(inscricao.dataNascimento || ''),
    idade: inscricao.idade || '',
    tamanhoCamisa: inscricao.tamanhoCamisa || '',
    alergico: inscricao.alergico || '',
    tipoAlergia: inscricao.tipoAlergia || '',
    restricaoMedicamentosa: inscricao.restricaoMedicamentosa || '',
    tipoRestricaoMedicamentosa: inscricao.tipoRestricaoMedicamentosa || '',
    nomeSocial: inscricao.nomeSocial || '',
    celular: inscricao.celular || '',
    nomePai: inscricao.nomePai || '',
    nomeMae: inscricao.nomeMae || '',
    enderecoCompleto: inscricao.enderecoCompleto || '',
    cidade: inscricao.cidade || '',
    estado: inscricao.estado || '',
    escola: inscricao.escola || '',
    turno: inscricao.turno || '',
    serie: inscricao.serie || '',
    grau: inscricao.grau || '',
    jaParticipouEncontro: inscricao.jaParticipouEncontro || '',
    qualEncontroAnterior: inscricao.qualEncontroAnterior || '',
    paisFizeramECC: inscricao.paisFizeramECC || '',
    batizado: inscricao.batizado || '',
    primeiraComunhao: inscricao.primeiraComunhao || '',
    crismado: inscricao.crismado || '',
    tocaInstrumento: inscricao.tocaInstrumento || '',
    gostaCantar: inscricao.gostaCantar || '',
    familiaOutraDoutrina: inscricao.familiaOutraDoutrina || '',
    quemConvidouEac: inscricao.quemConvidouEac || '',
    paroquia: inscricao.paroquia || '',
    motivoEncontro: inscricao.motivoEncontro || '',
    valorContribuicao: inscricao.valorContribuicao || '',
    visitadoTioVisitacao: inscricao.visitadoTioVisitacao || '',
    desistiu: inscricao.desistiu || '',
  });

  const [notifyResponsavel, setNotifyResponsavel] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'principais' | 'demais'>('principais');

  function updateField<K extends keyof UpdateInscricaoData>(field: K, value: UpdateInscricaoData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleDesistiuChange(value: '' | 'SIM' | 'NAO') {
    setForm((prev) => ({
      ...prev,
      desistiu: value,
      status: value === 'SIM' ? 'Nao confirmado' : prev.status,
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');

    if (form.alergico === 'SIM' && !String(form.tipoAlergia || '').trim()) {
      setError('Preencha o tipo de restrição alimentar quando marcar SIM.');
      return;
    }

    if (form.restricaoMedicamentosa === 'SIM' && !String(form.tipoRestricaoMedicamentosa || '').trim()) {
      setError('Preencha o tipo de restrição medicamentosa quando marcar SIM.');
      return;
    }

    if (form.jaParticipouEncontro === 'SIM' && !String(form.qualEncontroAnterior || '').trim()) {
      setError('Preencha o campo Qual quando marcar que já participou de outro encontro.');
      return;
    }

    try {
      setIsSaving(true);
      await onSubmit(
        {
          ...form,
          status: form.desistiu === 'SIM' ? 'Nao confirmado' : form.status,
          tipoAlergia: String(form.tipoAlergia || '').trim(),
          tipoRestricaoMedicamentosa: String(form.tipoRestricaoMedicamentosa || '').trim(),
          nomeSocial: String(form.nomeSocial || '').trim(),
          qualEncontroAnterior: String(form.qualEncontroAnterior || '').trim(),
          quemConvidouEac: String(form.quemConvidouEac || '').trim(),
          paroquia: String(form.paroquia || '').trim(),
          motivoEncontro: String(form.motivoEncontro || '').trim(),
          enderecoCompleto: String(form.enderecoCompleto || '').trim(),
          nomePai: String(form.nomePai || '').trim(),
          nomeMae: String(form.nomeMae || '').trim(),
        },
        { notifyResponsavel },
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1">
        <button
          type="button"
          onClick={() => setActiveTab('principais')}
          className={`h-10 rounded-md px-4 text-sm font-semibold ${
            activeTab === 'principais'
              ? 'bg-white text-[var(--color-brand-dark)] shadow-sm'
              : 'text-slate-600'
          }`}
        >
          Campos principais
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('demais')}
          className={`h-10 rounded-md px-4 text-sm font-semibold ${
            activeTab === 'demais'
              ? 'bg-white text-[var(--color-brand-dark)] shadow-sm'
              : 'text-slate-600'
          }`}
        >
          Demais informações
        </button>
      </div>

      {activeTab === 'principais' && (
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Campos principais</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label>Nome completo do adolescente</Label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => updateField('nome', e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 px-3"
            />
          </div>

          <div>
            <Label>Como gostaria de ser chamado no EAC</Label>
            <input
              type="text"
              value={form.nomeSocial}
              onChange={(e) => updateField('nomeSocial', e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 px-3"
            />
          </div>

          <div>
            <Label>E-mail do responsável</Label>
            <input
              type="text"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 px-3"
            />
          </div>

          <div>
            <Label>Status</Label>
            <select
              value={form.status}
              onChange={(e) => updateField('status', e.target.value)}
              disabled={form.desistiu === 'SIM'}
              className="h-11 w-full rounded-lg border border-slate-300 px-3"
            >
              <option value="">Selecione</option>
              <option value="Ativo">Ativo</option>
              <option value="Confirmado">Confirmado</option>
              <option value="Nao confirmado">Não confirmado</option>
              <option value="Pendente">Pendente</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>

          <div>
            <Label>Desistiu?</Label>
            <YesNoSelect value={form.desistiu} onChange={handleDesistiuChange} />
          </div>

          <div>
            <Label>Data de nascimento</Label>
            <input
              type="date"
              value={toDateInputValue(form.dataNascimento)}
              onChange={(e) => updateField('dataNascimento', fromDateInputValue(e.target.value))}
              className="h-11 w-full rounded-lg border border-slate-300 px-3"
            />
          </div>

          <div>
            <Label>Idade</Label>
            <input
              type="text"
              value={form.idade}
              onChange={(e) => updateField('idade', e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 px-3"
            />
          </div>

          <div>
            <Label>Telefone</Label>
            <input
              type="text"
              value={form.telefone}
              onChange={(e) => updateField('telefone', e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 px-3"
            />
          </div>

          <div>
            <Label>Celular</Label>
            <input
              type="text"
              value={form.celular}
              onChange={(e) => updateField('celular', e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 px-3"
            />
          </div>

          <div className="sm:col-span-2">
            <Label>Endereço completo</Label>
            <textarea
              value={form.enderecoCompleto}
              onChange={(e) => updateField('enderecoCompleto', e.target.value)}
              className="min-h-[84px] w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <Label>Bairro</Label>
            <input
              type="text"
              value={form.localidade}
              onChange={(e) => updateField('localidade', e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 px-3"
            />
          </div>

          <div>
            <Label>Cidade</Label>
            <input
              type="text"
              value={form.cidade}
              onChange={(e) => updateField('cidade', e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 px-3"
            />
          </div>

          <div>
            <Label>Estado</Label>
            <input
              type="text"
              value={form.estado}
              onChange={(e) => updateField('estado', e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 px-3"
            />
          </div>

          <div>
            <Label>Nome do pai</Label>
            <input
              type="text"
              value={form.nomePai}
              onChange={(e) => updateField('nomePai', e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 px-3"
            />
          </div>

          <div>
            <Label>Nome da mãe</Label>
            <input
              type="text"
              value={form.nomeMae}
              onChange={(e) => updateField('nomeMae', e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 px-3"
            />
          </div>

          <div>
            <Label>Sexo</Label>
            <input
              type="text"
              value={inscricao.sexo || ''}
              disabled
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 text-slate-600"
            />
          </div>

          <div>
            <Label>Data de cadastro</Label>
            <input
              type="text"
              value={formatDateBR(inscricao.dataCadastro || '')}
              disabled
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 text-slate-600"
            />
          </div>
        </div>
      </div>
      )}

      {activeTab === 'demais' && (
      <>
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Campos adicionais</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label>Escola em que estuda</Label>
            <input
              type="text"
              value={form.escola}
              onChange={(e) => updateField('escola', e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 px-3"
            />
          </div>

          <div>
            <Label>Turno</Label>
            <input
              type="text"
              value={form.turno}
              onChange={(e) => updateField('turno', e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 px-3"
            />
          </div>

          <div>
            <Label>Série</Label>
            <input
              type="text"
              value={form.serie}
              onChange={(e) => updateField('serie', e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 px-3"
            />
          </div>

          <div>
            <Label>Grau</Label>
            <input
              type="text"
              value={form.grau}
              onChange={(e) => updateField('grau', e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 px-3"
            />
          </div>

          <div>
            <Label>Quem te convidou para o EAC</Label>
            <input
              type="text"
              value={form.quemConvidouEac}
              onChange={(e) => updateField('quemConvidouEac', e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 px-3"
            />
          </div>

          <div>
            <Label>Qual paróquia pertence</Label>
            <input
              type="text"
              value={form.paroquia}
              onChange={(e) => updateField('paroquia', e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 px-3"
            />
          </div>

          <div>
            <Label>Tamanho de camisa</Label>
            <select
              value={form.tamanhoCamisa}
              onChange={(e) => updateField('tamanhoCamisa', e.target.value as UpdateInscricaoData['tamanhoCamisa'])}
              className="h-11 w-full rounded-lg border border-slate-300 px-3"
            >
              <option value="">Selecione</option>
              <option value="PP">PP</option>
              <option value="P">P</option>
              <option value="M">M</option>
              <option value="G">G</option>
              <option value="GG">GG</option>
              <option value="XG">XG</option>
            </select>
          </div>

          <div>
            <Label>Valor da contribuição</Label>
            <input
              type="text"
              value={form.valorContribuicao}
              onChange={(e) => updateField('valorContribuicao', e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 px-3"
            />
          </div>

          <div>
            <Label>Visitado pelo tio da visitação</Label>
            <YesNoSelect
              value={form.visitadoTioVisitacao}
              onChange={(next) => updateField('visitadoTioVisitacao', next)}
            />
          </div>

          <div className="sm:col-span-2">
            <Label>Por que quer fazer o encontro?</Label>
            <textarea
              value={form.motivoEncontro}
              onChange={(e) => updateField('motivoEncontro', e.target.value)}
              className="min-h-[84px] w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Perguntas com opções</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label>Já participou de algum encontro?</Label>
            <YesNoSelect
              value={form.jaParticipouEncontro}
              onChange={(next) => updateField('jaParticipouEncontro', next)}
            />
          </div>

          <div>
            <Label>Qual?</Label>
            <input
              type="text"
              value={form.qualEncontroAnterior}
              onChange={(e) => updateField('qualEncontroAnterior', e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 px-3"
            />
          </div>

          <div>
            <Label>Seus pais já fizeram ECC?</Label>
            <YesNoSelect value={form.paisFizeramECC} onChange={(next) => updateField('paisFizeramECC', next)} />
          </div>

          <div>
            <Label>É batizado?</Label>
            <YesNoSelect value={form.batizado} onChange={(next) => updateField('batizado', next)} />
          </div>

          <div>
            <Label>Fez a Primeira Comunhão?</Label>
            <YesNoSelect
              value={form.primeiraComunhao}
              onChange={(next) => updateField('primeiraComunhao', next)}
            />
          </div>

          <div>
            <Label>É crismado?</Label>
            <YesNoSelect value={form.crismado} onChange={(next) => updateField('crismado', next)} />
          </div>

          <div>
            <Label>Toca algum instrumento musical?</Label>
            <YesNoSelect
              value={form.tocaInstrumento}
              onChange={(next) => updateField('tocaInstrumento', next)}
            />
          </div>

          <div>
            <Label>Gosta de cantar?</Label>
            <YesNoSelect value={form.gostaCantar} onChange={(next) => updateField('gostaCantar', next)} />
          </div>

          <div>
            <Label>Alguém da família pertence a outra doutrina não católica?</Label>
            <YesNoSelect
              value={form.familiaOutraDoutrina}
              onChange={(next) => updateField('familiaOutraDoutrina', next)}
            />
          </div>

          <div>
            <Label>Restrição alimentar</Label>
            <YesNoSelect value={form.alergico} onChange={(next) => updateField('alergico', next)} />
          </div>

          <div className="sm:col-span-2">
            <Label>Se sim, qual restrição alimentar?</Label>
            <input
              type="text"
              value={form.tipoAlergia}
              onChange={(e) => updateField('tipoAlergia', e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 px-3"
            />
          </div>

          <div>
            <Label>Restrição medicamentosa</Label>
            <YesNoSelect
              value={form.restricaoMedicamentosa}
              onChange={(next) => updateField('restricaoMedicamentosa', next)}
            />
          </div>

          <div className="sm:col-span-2">
            <Label>Se sim, qual restrição medicamentosa?</Label>
            <input
              type="text"
              value={form.tipoRestricaoMedicamentosa}
              onChange={(e) => updateField('tipoRestricaoMedicamentosa', e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 px-3"
            />
          </div>
        </div>
      </div>
      </>
      )}

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={notifyResponsavel}
            onChange={(e) => setNotifyResponsavel(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          Deseja enviar e-mail ao responsável após salvar?
        </label>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="h-11 rounded-lg bg-[var(--color-brand-dark)] px-4 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isSaving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}
