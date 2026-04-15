export type StatusValue = 'Pendente' | 'Confirmado' | 'Cancelado' | 'Ativo' | string;
export type ShirtSize = 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XG';
export type AllergyValue = 'SIM' | 'NAO';

export interface Inscricao {
  rowIndex: number;
  nome: string;
  email: string;
  status: StatusValue;
  dataCadastro: string;
  telefone: string;
  localidade: string;
  dataNascimento: string;
  idade: string;
  sexo: string;
  tamanhoCamisa: ShirtSize | '';
  alergico: AllergyValue | '';
  tipoAlergia: string;
  nomeSocial: string;
}

export interface UpdateInscricaoData {
  nome: string;
  email: string;
  status: StatusValue;
  telefone: string;
  localidade: string;
  dataNascimento: string;
  idade: string;
  tamanhoCamisa: ShirtSize | '';
  alergico: AllergyValue | '';
  tipoAlergia: string;
  nomeSocial: string;
}
