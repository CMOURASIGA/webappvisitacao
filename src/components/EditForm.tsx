import React, { useState } from 'react';
import { Inscricao, UpdateInscricaoData } from '../types';

interface EditFormProps {
  inscricao: Inscricao;
  onSubmit: (data: UpdateInscricaoData) => Promise<void>;
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
    nomeSocial: inscricao.nomeSocial || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  function updateField<K extends keyof UpdateInscricaoData>(field: K, value: UpdateInscricaoData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');

    if (
      !form.tamanhoCamisa ||
      !form.alergico ||
      !String(form.tipoAlergia || '').trim() ||
      !String(form.nomeSocial || '').trim()
    ) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setIsSaving(true);
      await onSubmit({
        ...form,
        tipoAlergia: String(form.tipoAlergia || '').trim(),
        nomeSocial: String(form.nomeSocial || '').trim(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Dados principais</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label>Nome</Label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => updateField('nome', e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 px-3"
            />
          </div>

          <div>
            <Label>E-mail</Label>
            <input
              type="text"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
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
            <Label>Status</Label>
            <select
              value={form.status}
              onChange={(e) => updateField('status', e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 px-3"
            >
              <option value="">Selecione</option>
              <option value="Ativo">Ativo</option>
              <option value="Confirmado">Confirmado</option>
              <option value="Pendente">Pendente</option>
              <option value="Cancelado">Cancelado</option>
            </select>
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
            <Label>Idade</Label>
            <input
              type="text"
              value={form.idade}
              onChange={(e) => updateField('idade', e.target.value)}
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

          <div className="sm:col-span-2">
            <Label>Data de nascimento</Label>
            <input
              type="date"
              value={toDateInputValue(form.dataNascimento)}
              onChange={(e) => updateField('dataNascimento', fromDateInputValue(e.target.value))}
              className="h-11 w-full rounded-lg border border-slate-300 px-3"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Confirmação de dados</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
            <Label>É alérgico</Label>
            <select
              value={form.alergico}
              onChange={(e) => updateField('alergico', e.target.value as UpdateInscricaoData['alergico'])}
              className="h-11 w-full rounded-lg border border-slate-300 px-3"
            >
              <option value="">Selecione</option>
              <option value="SIM">SIM</option>
              <option value="NAO">NAO</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <Label>Qual tipo de alergia</Label>
            <input
              type="text"
              value={form.tipoAlergia}
              onChange={(e) => updateField('tipoAlergia', e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 px-3"
            />
          </div>

          <div className="sm:col-span-2">
            <Label>Nome social</Label>
            <input
              type="text"
              value={form.nomeSocial}
              onChange={(e) => updateField('nomeSocial', e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 px-3"
            />
          </div>
        </div>
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