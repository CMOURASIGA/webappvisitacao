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

function isLikelyAppsScriptExecUrl(url: string): boolean {
  return /^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec\/?$/i.test(url);
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

  const normalized = selectedUrl.endsWith('/') ? selectedUrl.slice(0, -1) : selectedUrl;
  if (!isLikelyAppsScriptExecUrl(normalized)) {
    throw new Error(
      `URL da API invalida (${normalized}). Configure VITE_APPS_SCRIPT_URL(_LOCAL) com a URL Web App do Apps Script terminando em /exec.`,
    );
  }

  return normalized;
}

function getRequestBase(): string {
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
    restricaoMedicamentosa: (safe.restricaoMedicamentosa ?? '') as Inscricao['restricaoMedicamentosa'],
    tipoRestricaoMedicamentosa: String(safe.tipoRestricaoMedicamentosa ?? ''),
    nomeSocial: String(safe.nomeSocial ?? ''),
    celular: String(safe.celular ?? ''),
    nomePai: String(safe.nomePai ?? ''),
    nomeMae: String(safe.nomeMae ?? ''),
    enderecoCompleto: String(safe.enderecoCompleto ?? ''),
    cidade: String(safe.cidade ?? ''),
    estado: String(safe.estado ?? ''),
    escola: String(safe.escola ?? ''),
    turno: String(safe.turno ?? ''),
    serie: String(safe.serie ?? ''),
    grau: String(safe.grau ?? ''),
    jaParticipouEncontro: (safe.jaParticipouEncontro ?? '') as Inscricao['jaParticipouEncontro'],
    qualEncontroAnterior: String(safe.qualEncontroAnterior ?? ''),
    paisFizeramECC: (safe.paisFizeramECC ?? '') as Inscricao['paisFizeramECC'],
    batizado: (safe.batizado ?? '') as Inscricao['batizado'],
    primeiraComunhao: (safe.primeiraComunhao ?? '') as Inscricao['primeiraComunhao'],
    crismado: (safe.crismado ?? '') as Inscricao['crismado'],
    tocaInstrumento: (safe.tocaInstrumento ?? '') as Inscricao['tocaInstrumento'],
    gostaCantar: (safe.gostaCantar ?? '') as Inscricao['gostaCantar'],
    familiaOutraDoutrina: (safe.familiaOutraDoutrina ?? '') as Inscricao['familiaOutraDoutrina'],
    quemConvidouEac: String(safe.quemConvidouEac ?? ''),
    paroquia: String(safe.paroquia ?? ''),
    motivoEncontro: String(safe.motivoEncontro ?? ''),
    valorContribuicao: String(safe.valorContribuicao ?? ''),
    visitadoTioVisitacao: (safe.visitadoTioVisitacao ?? '') as Inscricao['visitadoTioVisitacao'],
    desistiu: (safe.desistiu ?? '') as Inscricao['desistiu'],
  };
}

async function parseJsonResponse(response: Response, requestUrl: string): Promise<unknown> {
  const text = await response.text();
  try {
    return JSON.parse(text) as unknown;
  } catch {
    const preview = text.slice(0, 180).replace(/\s+/g, ' ');
    throw new Error(
      `Resposta nao JSON da API. URL: ${requestUrl}. Verifique se VITE_APPS_SCRIPT_URL(_LOCAL) aponta para o /exec correto do Apps Script. Trecho: ${preview}`,
    );
  }
}

export async function readInscricoes(q = ''): Promise<Inscricao[]> {
  const url = new URL(getRequestBase(), window.location.origin);
  url.searchParams.set('action', 'read');
  if (q.trim()) {
    url.searchParams.set('q', q.trim());
  }

  const requestUrl = url.toString();
  const response = await fetch(requestUrl);
  if (!response.ok) {
    throw new Error('Falha ao carregar registros.');
  }

  const payload = await parseJsonResponse(response, requestUrl);
  if (!Array.isArray(payload)) {
    throw new Error('Resposta invalida da API.');
  }

  return payload
    .map(normalizeInscricao)
    .filter((item) => Number.isFinite(item.rowIndex) && item.rowIndex > 1 && item.nome.trim());
}

export async function updateInscricao(
  rowIndex: number,
  data: UpdateInscricaoData,
  notifyResponsavel = false,
): Promise<void> {
  // Apps Script Web App does not answer CORS preflight OPTIONS reliably.
  // Sending plain text JSON keeps this as a simple POST request.
  const requestBase = getRequestBase();
  const response = await fetch(requestBase, {
    method: 'POST',
    body: JSON.stringify({ action: 'update', rowIndex, data, notifyResponsavel }),
  });

  if (!response.ok) {
    throw new Error('Falha ao salvar registro.');
  }

  const payload = (await parseJsonResponse(response, requestBase)) as { error?: string | boolean; message?: string };
  if (payload?.error) {
    throw new Error(String(payload.message || payload.error));
  }
}
