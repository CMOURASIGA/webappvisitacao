export interface CarroAcesso {
  numero: number;
  usuario: string;
  senha: string;
  responsavel: string;
}

const TOTAL_CARROS = 100;

export const carrosAcesso: CarroAcesso[] = Array.from({ length: TOTAL_CARROS }, (_, index) => {
  const numero = index + 1;
  const sufixo = String(numero).padStart(2, '0');

  return {
    numero,
    usuario: `carro${sufixo}`,
    senha: 'car123456',
    responsavel: `Responsavel carro ${sufixo}`,
  };
});

export function validarAcessoCarro(usuario: string, senha: string): CarroAcesso | null {
  const user = String(usuario || '').trim().toLowerCase();
  const pass = String(senha || '').trim();

  return carrosAcesso.find((item) => item.usuario === user && item.senha === pass) || null;
}
