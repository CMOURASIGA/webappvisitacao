import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Inscricao, UpdateInscricaoData } from '../types';
import { Loader2, AlertCircle } from 'lucide-react';

const schema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  idade: z.string().min(1, 'Idade é obrigatória'),
  localidade: z.string().min(1, 'Localidade é obrigatória'),
  status: z.enum(['Pendente', 'Confirmado', 'Cancelado'], {
    errorMap: () => ({ message: 'Selecione um status válido' })
  }),
  tamanhoCamisa: z.enum(['PP', 'P', 'M', 'G', 'GG', 'XG'], {
    errorMap: () => ({ message: 'Selecione um tamanho válido' })
  }),
  alergico: z.enum(['SIM', 'NAO'], {
    errorMap: () => ({ message: 'Selecione SIM ou NÃO' })
  }),
  tipoAlergia: z.string().min(1, 'Informe o tipo de alergia (ou "Nenhuma" se não houver)'),
  nomeSocial: z.string().min(1, 'Informe o nome social (ou repita o primeiro nome)'),
});

type FormData = z.infer<typeof schema>;

interface EditFormProps {
  inscricao: Inscricao;
  onSubmit: (data: UpdateInscricaoData) => Promise<void>;
  onCancel: () => void;
}

export function EditForm({ inscricao, onSubmit, onCancel }: EditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: inscricao.nome || '',
      idade: inscricao.idade || '',
      localidade: inscricao.localidade || '',
      status: (inscricao.status as any) || 'Pendente',
      tamanhoCamisa: (inscricao.tamanhoCamisa as any) || undefined,
      alergico: (inscricao.alergico as any) || undefined,
      tipoAlergia: inscricao.tipoAlergia || '',
      nomeSocial: inscricao.nomeSocial || '',
    }
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(data);
    } catch (err) {
      setError('Ocorreu um erro ao salvar os dados. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-5 h-full">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="flex flex-col gap-[6px]">
        <label className="text-[12px] font-semibold text-slate-500 uppercase">
          Nome Completo <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('nome')}
          className="p-2.5 border border-slate-200 rounded-md text-[14px] focus:outline-none focus:border-blue-600 w-full"
        />
        {errors.nome && <p className="mt-1 text-xs text-red-600">{errors.nome.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-[6px]">
          <label className="text-[12px] font-semibold text-slate-500 uppercase">
            Idade <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('idade')}
            className="p-2.5 border border-slate-200 rounded-md text-[14px] focus:outline-none focus:border-blue-600 w-full"
          />
          {errors.idade && <p className="mt-1 text-xs text-red-600">{errors.idade.message}</p>}
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[12px] font-semibold text-slate-500 uppercase">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            {...register('status')}
            className="p-2.5 border border-slate-200 rounded-md text-[14px] focus:outline-none focus:border-blue-600 w-full bg-white"
          >
            <option value="Pendente">Pendente</option>
            <option value="Confirmado">Confirmado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
          {errors.status && <p className="mt-1 text-xs text-red-600">{errors.status.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-[6px]">
        <label className="text-[12px] font-semibold text-slate-500 uppercase">
          Localidade/Bairro <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('localidade')}
          className="p-2.5 border border-slate-200 rounded-md text-[14px] focus:outline-none focus:border-blue-600 w-full"
        />
        {errors.localidade && <p className="mt-1 text-xs text-red-600">{errors.localidade.message}</p>}
      </div>

      <div className="h-px bg-slate-200 my-2"></div>

      <div className="flex flex-col gap-[6px]">
        <label className="text-[12px] font-semibold text-slate-500 uppercase">
          Nome Social <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('nomeSocial')}
          className="p-2.5 border border-slate-200 rounded-md text-[14px] focus:outline-none focus:border-blue-600 w-full"
          placeholder="Nome como deseja ser chamado"
        />
        {errors.nomeSocial && <p className="mt-1 text-xs text-red-600">{errors.nomeSocial.message}</p>}
      </div>

      <div className="flex flex-col gap-[6px]">
        <label className="text-[12px] font-semibold text-slate-500 uppercase">
          Tamanho de Camisa <span className="text-red-500">*</span>
        </label>
        <select
          {...register('tamanhoCamisa')}
          className="p-2.5 border border-slate-200 rounded-md text-[14px] focus:outline-none focus:border-blue-600 w-full bg-white"
        >
          <option value="">Selecione...</option>
          <option value="PP">PP</option>
          <option value="P">P</option>
          <option value="M">M</option>
          <option value="G">G</option>
          <option value="GG">GG</option>
          <option value="XG">XG</option>
        </select>
        {errors.tamanhoCamisa && <p className="mt-1 text-xs text-red-600">{errors.tamanhoCamisa.message}</p>}
      </div>

      <div className="flex flex-col gap-[6px]">
        <label className="text-[12px] font-semibold text-slate-500 uppercase">
          É Alérgico? <span className="text-red-500">*</span>
        </label>
        <select
          {...register('alergico')}
          className="p-2.5 border border-slate-200 rounded-md text-[14px] focus:outline-none focus:border-blue-600 w-full bg-white"
        >
          <option value="">Selecione...</option>
          <option value="SIM">SIM</option>
          <option value="NAO">NÃO</option>
        </select>
        {errors.alergico && <p className="mt-1 text-xs text-red-600">{errors.alergico.message}</p>}
      </div>

      <div className="flex flex-col gap-[6px]">
        <label className="text-[12px] font-semibold text-slate-500 uppercase">
          Qual tipo de alergia <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('tipoAlergia')}
          className="p-2.5 border border-slate-200 rounded-md text-[14px] focus:outline-none focus:border-blue-600 w-full h-[60px] resize-none"
          placeholder="Descreva a alergia ou digite 'NENHUMA'"
        />
        {errors.tipoAlergia && <p className="mt-1 text-xs text-red-600">{errors.tipoAlergia.message}</p>}
      </div>

      <div className="mt-[10px] flex flex-col gap-[10px]">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-[48px] px-5 py-2.5 rounded-lg font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Salvando...
            </>
          ) : (
            'Salvar Alterações'
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-full px-5 py-2.5 rounded-lg font-semibold text-sm bg-transparent border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>

      <div className="mt-auto p-3 bg-slate-50 rounded-lg flex items-center gap-2.5 text-[13px] text-slate-800">
        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
        <span>Sistema Online - Sheets v4 API</span>
      </div>
    </form>
  );
}
