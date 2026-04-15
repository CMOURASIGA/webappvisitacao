import React from 'react';
import { CalendarDays, Edit2, Eye, Mail, Phone } from 'lucide-react';
import { Inscricao } from '../types';
import { cn } from './Modal';

interface CardProps {
  inscricao: Inscricao;
  onView: (inscricao: Inscricao) => void;
  onEdit: (inscricao: Inscricao) => void;
}

const STATUS_CLASSES: Record<string, { stripe: string; badge: string }> = {
  Confirmado: {
    stripe: 'bg-[var(--color-confirmed)]',
    badge: 'bg-emerald-100 text-emerald-800',
  },
  Ativo: {
    stripe: 'bg-[var(--color-confirmed)]',
    badge: 'bg-emerald-100 text-emerald-800',
  },
  Pendente: {
    stripe: 'bg-[var(--color-pending)]',
    badge: 'bg-amber-100 text-amber-800',
  },
  Cancelado: {
    stripe: 'bg-[var(--color-cancelled)]',
    badge: 'bg-rose-100 text-rose-800',
  },
};

function getInitials(value: string): string {
  const source = String(value || '').trim();
  if (!source) return '??';
  const pieces = source.split(/\s+/).filter(Boolean);
  if (pieces.length === 1) return pieces[0].slice(0, 2).toUpperCase();
  return `${pieces[0][0]}${pieces[1][0]}`.toUpperCase();
}

function isIncomplete(inscricao: Inscricao): boolean {
  return (
    !inscricao.tamanhoCamisa ||
    !inscricao.alergico ||
    !String(inscricao.tipoAlergia || '').trim() ||
    !String(inscricao.nomeSocial || '').trim()
  );
}

function getAgeLabel(idade: string): string {
  return idade ? `${idade} anos` : 'Idade nao informada';
}

function formatDateBR(value: string): string {
  if (!value) return 'Data nao informada';
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

export function Card({ inscricao, onView, onEdit }: CardProps) {
  const statusUI = STATUS_CLASSES[inscricao.status] ?? STATUS_CLASSES.Pendente;
  const incomplete = isIncomplete(inscricao);
  const nome = inscricao.nome || 'Nome nao informado';
  const email = inscricao.email || 'E-mail nao informado';
  const telefone = inscricao.telefone || 'Telefone nao informado';
  const bairro = inscricao.localidade || 'Bairro nao informado';
  const dataCadastro = formatDateBR(inscricao.dataCadastro || '');

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className={cn('h-[3px] w-full', statusUI.stripe)} />

      <div className="flex flex-col gap-4 p-4">
        <header className="flex items-start gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-slate-100 text-sm font-bold tracking-wide text-slate-700">
            {getInitials(nome)}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[18px] font-semibold leading-tight text-slate-900">{nome}</h3>
            <p className="mt-1 text-sm text-slate-500">
              #{inscricao.rowIndex} · <strong className="font-semibold text-slate-700">{bairro}</strong> · {getAgeLabel(inscricao.idade)}
            </p>
          </div>

          <span className={cn('shrink-0 rounded-full px-3 py-1 text-xs font-semibold', statusUI.badge)}>
            {inscricao.status || 'Status nao informado'}
          </span>
        </header>

        <div className="space-y-2 text-[15px] text-slate-700">
          <p className="flex items-center gap-2">
            <Phone size={16} className="shrink-0 text-slate-500" />
            <span>{telefone}</span>
          </p>

          <p className="flex items-center gap-2">
            <Mail size={16} className="shrink-0 text-slate-500" />
            <span className="truncate">{email}</span>
          </p>

          <p className="flex items-center gap-2">
            <CalendarDays size={16} className="shrink-0 text-slate-500" />
            <span>{dataCadastro}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {incomplete ? (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-800">
              Dados incompletos
            </span>
          ) : (
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
              Dados completos
            </span>
          )}
        </div>

        <div className="mt-1 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onView(inscricao)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white text-base font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <Eye size={18} />
            Ver
          </button>

          <button
            type="button"
            onClick={() => onEdit(inscricao)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-transparent bg-[var(--color-brand-dark)] text-base font-semibold text-white transition-colors hover:brightness-110"
          >
            <Edit2 size={18} />
            Editar registro
          </button>
        </div>
      </div>
    </article>
  );
}
