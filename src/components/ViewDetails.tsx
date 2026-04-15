import React from 'react';
import { Inscricao } from '../types';

interface ViewDetailsProps {
  inscricao: Inscricao;
}

export function ViewDetails({ inscricao }: ViewDetailsProps) {
  const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col gap-1 py-3 border-b border-slate-100 last:border-0">
      <dt className="text-[12px] font-semibold text-slate-500 uppercase">{label}</dt>
      <dd className="text-[14px] text-slate-800">{value || <span className="text-slate-400 italic">Não informado</span>}</dd>
    </div>
  );

  return (
    <dl className="flex flex-col gap-2">
      <DetailRow label="Nome Completo" value={inscricao.nome} />
      <DetailRow label="Nome Social" value={inscricao.nomeSocial} />
      <DetailRow label="Idade" value={inscricao.idade} />
      <DetailRow label="Localidade/Bairro" value={inscricao.localidade} />
      <DetailRow label="Data de Cadastro" value={inscricao.dataCadastro} />
      <DetailRow label="Status Original" value={inscricao.status} />
      
      <div className="mt-4 mb-2">
        <h4 className="text-[14px] font-bold text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200">Dados Complementares</h4>
      </div>
      
      <DetailRow label="Tamanho de Camisa" value={inscricao.tamanhoCamisa} />
      <DetailRow label="É Alérgico?" value={inscricao.alergico} />
      <DetailRow label="Tipo de Alergia" value={inscricao.tipoAlergia} />
    </dl>
  );
}
