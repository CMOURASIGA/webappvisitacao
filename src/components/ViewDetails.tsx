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
          <Field label="Nome completo" value={inscricao.nome} />
          <Field label="Nome social" value={inscricao.nomeSocial} />
          <Field label="E-mail" value={inscricao.email} />
          <Field label="Telefone" value={inscricao.telefone} />
          <Field label="Celular" value={inscricao.celular} />
          <Field label="Status" value={inscricao.status} />
          <Field label="Endereco completo" value={inscricao.enderecoCompleto} />
          <Field label="Bairro" value={inscricao.localidade} />
          <Field label="Cidade" value={inscricao.cidade} />
          <Field label="Estado" value={inscricao.estado} />
          <Field label="Idade" value={inscricao.idade} />
          <Field label="Sexo" value={inscricao.sexo} />
          <Field label="Nome do pai" value={inscricao.nomePai} />
          <Field label="Nome da mae" value={inscricao.nomeMae} />
          <Field label="Data de cadastro" value={formatDateBR(inscricao.dataCadastro)} />
          <Field label="Data de nascimento" value={formatDateBR(inscricao.dataNascimento)} />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Campos adicionais</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Escola" value={inscricao.escola} />
          <Field label="Turno" value={inscricao.turno} />
          <Field label="Serie" value={inscricao.serie} />
          <Field label="Grau" value={inscricao.grau} />
          <Field label="Quem convidou para o EAC" value={inscricao.quemConvidouEac} />
          <Field label="Paroquia" value={inscricao.paroquia} />
          <Field label="Motivo para fazer o encontro" value={inscricao.motivoEncontro} />
          <Field label="Valor da contribuicao" value={inscricao.valorContribuicao} />
          <Field label="Visitado pelo tio da visitacao" value={inscricao.visitadoTioVisitacao} />
          <Field label="Tamanho de camisa" value={inscricao.tamanhoCamisa} />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Perguntas com opcoes</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Ja participou de algum encontro?" value={inscricao.jaParticipouEncontro} />
          <Field label="Qual encontro ja participou?" value={inscricao.qualEncontroAnterior} />
          <Field label="Seus pais ja fizeram ECC?" value={inscricao.paisFizeramECC} />
          <Field label="E batizado?" value={inscricao.batizado} />
          <Field label="Fez a Primeira Comunhao?" value={inscricao.primeiraComunhao} />
          <Field label="E crismado?" value={inscricao.crismado} />
          <Field label="Toca instrumento musical?" value={inscricao.tocaInstrumento} />
          <Field label="Gosta de cantar?" value={inscricao.gostaCantar} />
          <Field label="Familia em outra doutrina nao catolica?" value={inscricao.familiaOutraDoutrina} />
          <Field label="Restricao alimentar" value={inscricao.alergico} />
          <Field label="Se sim, qual restricao?" value={inscricao.tipoAlergia} />
        </div>
      </div>
    </div>
  );
}
