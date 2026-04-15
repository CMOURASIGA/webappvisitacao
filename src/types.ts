export interface Inscricao {
  rowIndex: number;
  dataCadastro: string;
  nome: string;
  localidade: string;
  idade: string;
  status: string;
  tamanhoCamisa: string;
  alergico: string;
  tipoAlergia: string;
  nomeSocial: string;
}

export interface UpdateInscricaoData {
  nome: string;
  idade: string;
  localidade: string;
  status: string;
  tamanhoCamisa: string;
  alergico: string;
  tipoAlergia: string;
  nomeSocial: string;
}
