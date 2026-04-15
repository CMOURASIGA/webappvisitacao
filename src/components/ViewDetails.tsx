import React from 'react';
import { Inscricao } from '../types';

interface ViewDetailsProps {
  inscricao: Inscricao;
}

function formatDateBR(value: string): string {
  if (!value) return 'Nao informado';
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

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-sm text-slate-800">{value || 'Nao informado'}</p>
    </div>
  );
}

export function ViewDetails({ inscricao }: ViewDetailsProps) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Dados principais</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Nome" value={inscricao.nome} />
          <Field label="E-mail" value={inscricao.email} />
          <Field label="Telefone" value={inscricao.telefone} />
          <Field label="Status" value={inscricao.status} />
          <Field label="Bairro" value={inscricao.localidade} />
          <Field label="Idade" value={inscricao.idade} />
          <Field label="Sexo" value={inscricao.sexo} />
          <Field label="Data de cadastro" value={formatDateBR(inscricao.dataCadastro)} />
          <Field label="Data de nascimento" value={formatDateBR(inscricao.dataNascimento)} />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Confirmacao de dados</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Tamanho de camisa" value={inscricao.tamanhoCamisa} />
          <Field label="E alergico" value={inscricao.alergico} />
          <Field label="Qual tipo de alergia" value={inscricao.tipoAlergia} />
          <Field label="Nome social" value={inscricao.nomeSocial} />
        </div>
      </div>
    </div>
  );
}
