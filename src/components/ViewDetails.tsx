import React from 'react';
import { Inscricao } from '../types';

interface ViewDetailsProps {
  inscricao: Inscricao;
}

function formatDateBR(value: string): string {
  if (!value) return 'Não informado';
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
      <p className="text-sm text-slate-800">{value || 'Não informado'}</p>
    </div>
  );
}

function formatStatusLabel(status: string): string {
  if (status === 'Nao confirmado') return 'Não confirmado';
  return status;
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
          <Field label="Status" value={formatStatusLabel(inscricao.status)} />
          <Field label="Endereço completo" value={inscricao.enderecoCompleto} />
          <Field label="Bairro" value={inscricao.localidade} />
          <Field label="Cidade" value={inscricao.cidade} />
          <Field label="Estado" value={inscricao.estado} />
          <Field label="Idade" value={inscricao.idade} />
          <Field label="Sexo" value={inscricao.sexo} />
          <Field label="Nome do pai" value={inscricao.nomePai} />
          <Field label="Nome da mãe" value={inscricao.nomeMae} />
          <Field label="Data de cadastro" value={formatDateBR(inscricao.dataCadastro)} />
          <Field label="Data de nascimento" value={formatDateBR(inscricao.dataNascimento)} />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Campos adicionais</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Escola" value={inscricao.escola} />
          <Field label="Turno" value={inscricao.turno} />
          <Field label="Série" value={inscricao.serie} />
          <Field label="Grau" value={inscricao.grau} />
          <Field label="Quem convidou para o EAC" value={inscricao.quemConvidouEac} />
          <Field label="Paróquia" value={inscricao.paroquia} />
          <Field label="Motivo para fazer o encontro" value={inscricao.motivoEncontro} />
          <Field label="Valor da contribuição" value={inscricao.valorContribuicao} />
          <Field label="Visitado pelo tio da visitação" value={inscricao.visitadoTioVisitacao} />
          <Field label="Desistiu" value={inscricao.desistiu} />
          <Field label="Tamanho de camisa" value={inscricao.tamanhoCamisa} />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Perguntas com opções</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Já participou de algum encontro?" value={inscricao.jaParticipouEncontro} />
          <Field label="Qual encontro já participou?" value={inscricao.qualEncontroAnterior} />
          <Field label="Seus pais já fizeram ECC?" value={inscricao.paisFizeramECC} />
          <Field label="É batizado?" value={inscricao.batizado} />
          <Field label="Fez a Primeira Comunhão?" value={inscricao.primeiraComunhao} />
          <Field label="É crismado?" value={inscricao.crismado} />
          <Field label="Toca instrumento musical?" value={inscricao.tocaInstrumento} />
          <Field label="Gosta de cantar?" value={inscricao.gostaCantar} />
          <Field label="Família em outra doutrina não católica?" value={inscricao.familiaOutraDoutrina} />
          <Field label="Restrição alimentar" value={inscricao.alergico} />
          <Field label="Se sim, qual restrição alimentar?" value={inscricao.tipoAlergia} />
          <Field label="Restrição medicamentosa" value={inscricao.restricaoMedicamentosa} />
          <Field
            label="Se sim, qual restrição medicamentosa?"
            value={inscricao.tipoRestricaoMedicamentosa}
          />
        </div>
      </div>
    </div>
  );
}
