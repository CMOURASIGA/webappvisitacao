import { Inscricao, UpdateInscricaoData } from '../types';

const runtimeEnv = import.meta.env as {
  DEV?: boolean;
  VITE_APPS_SCRIPT_URL_LOCAL?: string;
  VITE_APPS_SCRIPT_URL?: string;
  VITE_API_URL?: string;
};

function normalizeUrl(value?: string): string {
  return String(value || '').trim();
}

function getBaseUrl(): string {
  const localUrl = normalizeUrl(runtimeEnv.VITE_APPS_SCRIPT_URL_LOCAL);
  const productionUrl = normalizeUrl(runtimeEnv.VITE_APPS_SCRIPT_URL);
  const legacyUrl = normalizeUrl(runtimeEnv.VITE_API_URL);

  const selectedUrl = runtimeEnv.DEV
    ? localUrl || productionUrl || legacyUrl
    : productionUrl || localUrl || legacyUrl;

  if (!selectedUrl) {
    throw new Error(
      'URL da API nao configurada. Defina VITE_APPS_SCRIPT_URL_LOCAL (.env.local) para dev e VITE_APPS_SCRIPT_URL para producao.',
    );
  }

  return selectedUrl.endsWith('/') ? selectedUrl.slice(0, -1) : selectedUrl;
}

function getRequestBase(): string {
  if (runtimeEnv.DEV) {
    return '/api';
  }
  return getBaseUrl();
}

function normalizeInscricao(item: unknown): Inscricao {
  const safe = (item ?? {}) as Record<string, unknown>;

  return {
    rowIndex: Number(safe.rowIndex),
    nome: String(safe.nome ?? ''),
    email: String(safe.email ?? ''),
    status: String(safe.status ?? ''),
    dataCadastro: String(safe.dataCadastro ?? ''),
    telefone: String(safe.telefone ?? ''),
    localidade: String(safe.localidade ?? ''),
    dataNascimento: String(safe.dataNascimento ?? ''),
    idade: String(safe.idade ?? ''),
    sexo: String(safe.sexo ?? ''),
    tamanhoCamisa: (safe.tamanhoCamisa ?? '') as Inscricao['tamanhoCamisa'],
    alergico: (safe.alergico ?? '') as Inscricao['alergico'],
    tipoAlergia: String(safe.tipoAlergia ?? ''),
    nomeSocial: String(safe.nomeSocial ?? ''),
  };
}

async function parseJsonResponse(response: Response): Promise<unknown> {
  const text = await response.text();
  try {
    return JSON.parse(text) as unknown;
  } catch {
    const preview = text.slice(0, 180).replace(/\s+/g, ' ');
    throw new Error(`Resposta nao-JSON da API. Verifique permissao/URL do Apps Script. Trecho: ${preview}`);
  }
}

export async function readInscricoes(q = ''): Promise<Inscricao[]> {
  const url = new URL(getRequestBase(), window.location.origin);
  url.searchParams.set('action', 'read');
  if (q.trim()) {
    url.searchParams.set('q', q.trim());
  }

  const requestUrl = runtimeEnv.DEV ? `${url.pathname}${url.search}` : url.toString();
  const response = await fetch(requestUrl);
  if (!response.ok) {
    throw new Error('Falha ao carregar registros.');
  }

  const payload = await parseJsonResponse(response);
  if (!Array.isArray(payload)) {
    throw new Error('Resposta invalida da API.');
  }

  return payload
    .map(normalizeInscricao)
    .filter((item) => Number.isFinite(item.rowIndex) && item.rowIndex > 1 && item.nome.trim());
}

export async function updateInscricao(rowIndex: number, data: UpdateInscricaoData): Promise<void> {
  const response = await fetch(getRequestBase(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'update', rowIndex, data }),
  });

  if (!response.ok) {
    throw new Error('Falha ao salvar registro.');
  }

  const payload = (await parseJsonResponse(response)) as { error?: string | boolean; message?: string };
  if (payload?.error) {
    throw new Error(String(payload.message || payload.error));
  }
}
