import React from 'react';
import { Eye, Edit2, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Inscricao } from '../types';
import { cn } from './Modal';

interface CardProps {
  inscricao: Inscricao;
  onView: (inscricao: Inscricao) => void;
  onEdit: (inscricao: Inscricao) => void;
}

export function Card({ inscricao, onView, onEdit }: CardProps) {
  const statusLower = inscricao.status?.toLowerCase() || '';
  const isConfirmado = statusLower === 'confirmado';
  const isCancelado = statusLower === 'cancelado';
  const isPendente = !isConfirmado && !isCancelado;

  const getStatusIcon = () => {
    if (isConfirmado) return <CheckCircle2 size={14} className="mr-1" />;
    if (isCancelado) return <XCircle size={14} className="mr-1" />;
    return <Clock size={14} className="mr-1" />;
  };

  const getStatusText = () => {
    if (isConfirmado) return 'Confirmado';
    if (isCancelado) return 'Cancelado';
    return 'Pendente';
  };

  const getStatusColor = () => {
    if (isConfirmado) return 'bg-green-100 text-green-700';
    if (isCancelado) return 'bg-red-100 text-red-700';
    return 'bg-amber-100 text-amber-700';
  };

  return (
    <div className="bg-white rounded-[16px] p-5 border border-slate-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-bold text-[16px] text-slate-800 uppercase leading-tight">
            {inscricao.nome || 'Sem nome'}
          </div>
          <div className="text-[13px] text-slate-500 mt-1">
            ID: #{inscricao.rowIndex} | {inscricao.idade ? `${inscricao.idade} anos` : 'Idade não informada'}
          </div>
        </div>
        <span className={cn(
          "px-2 py-1 rounded-md text-[11px] font-bold uppercase whitespace-nowrap ml-2 flex items-center",
          getStatusColor()
        )}>
          {getStatusIcon()}
          {getStatusText()}
        </span>
      </div>

      <div className="text-[13px] text-slate-500">
        📍 {inscricao.localidade || 'Localidade não informada'} | 📅 {inscricao.dataCadastro || 'Data não informada'}
      </div>

      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onView(inscricao)}
          title="Ver Detalhes"
          className="p-2 flex-1 flex justify-center items-center rounded-lg bg-transparent border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <Eye size={18} />
        </button>
        <button
          onClick={() => onEdit(inscricao)}
          title="Editar Registro"
          className="p-2 flex-1 flex justify-center items-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          <Edit2 size={18} />
        </button>
      </div>
    </div>
  );
}
