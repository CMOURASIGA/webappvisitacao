import { useCallback, useEffect, useState } from 'react';
import { readInscricoes } from '../api/sheets';
import { Inscricao } from '../types';

export function useInscricoes() {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await readInscricoes();
      setInscricoes(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Nao foi possivel carregar as inscricoes.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    inscricoes,
    setInscricoes,
    isLoading,
    error,
    refresh,
  };
}
