const SPREADSHEET_ID = '1I988yRvGYfjhoqmFvdQbjO9qWzTB4T6yv0dDBxQ-oEg';
const SHEET_NAME = 'Inscricoes_Prioritarias';

const COL = {
  nome: 0,            // A
  email: 1,           // B
  status: 2,          // C
  dataCadastro: 3,    // D
  telefone: 4,        // E
  localidade: 5,      // F
  dataNascimento: 14, // O
  idade: 15,          // P
  sexo: 16,           // Q
  tamanhoCamisa: 20,  // U
  alergico: 21,       // V
  tipoAlergia: 22,    // W
  nomeSocial: 23,     // X
  celular: 24,                // Y
  nomePai: 25,                // Z
  nomeMae: 26,                // AA
  enderecoCompleto: 27,       // AB
  cidade: 28,                 // AC
  estado: 29,                 // AD
  escola: 30,                 // AE
  turno: 31,                  // AF
  serie: 32,                  // AG
  grau: 33,                   // AH
  jaParticipouEncontro: 34,   // AI
  qualEncontroAnterior: 35,   // AJ
  paisFizeramECC: 36,         // AK
  batizado: 37,               // AL
  primeiraComunhao: 38,       // AM
  crismado: 39,               // AN
  tocaInstrumento: 40,        // AO
  gostaCantar: 41,            // AP
  familiaOutraDoutrina: 42,   // AQ
  quemConvidouEac: 43,        // AR
  paroquia: 44,               // AS
  motivoEncontro: 45,         // AT
  valorContribuicao: 46,      // AU
  visitadoTioVisitacao: 47,   // AV
  desistiu: 48,               // AW
  restricaoMedicamentosa: 49, // AX
  tipoRestricaoMedicamentosa: 50, // AY
};

const HEADER_BY_KEY = {
  nome: 'Nome',
  email: 'E-mail',
  status: 'Status',
  dataCadastro: 'Data Cadastro',
  telefone: 'Telefone',
  localidade: 'Bairro',
  dataNascimento: 'Data de nascimento',
  idade: 'Idade',
  sexo: 'Sexo',
  tamanhoCamisa: 'Tamanho camisa',
  alergico: 'Alergico',
  tipoAlergia: 'Observacao Alergico',
  nomeSocial: 'Nome Social',
  celular: 'Celular',
  nomePai: 'Nome do pai',
  nomeMae: 'Nome da mae',
  enderecoCompleto: 'Endereco completo',
  cidade: 'Cidade',
  estado: 'Estado',
  escola: 'Escola em que estuda',
  turno: 'Turno',
  serie: 'Serie',
  grau: 'Grau',
  jaParticipouEncontro: 'Ja participou de algum encontro?',
  qualEncontroAnterior: 'Qual encontro?',
  paisFizeramECC: 'Seus pais ja fizeram ECC?',
  batizado: 'E batizado?',
  primeiraComunhao: 'Fez a Primeira Comunhao?',
  crismado: 'E crismado?',
  tocaInstrumento: 'Toca algum instrumento musical?',
  gostaCantar: 'Gosta de cantar?',
  familiaOutraDoutrina: 'Familia em outra doutrina nao catolica?',
  quemConvidouEac: 'Quem te convidou para o EAC',
  paroquia: 'Qual paroquia pertence',
  motivoEncontro: 'Por que quer fazer o encontro?',
  valorContribuicao: 'Valor da contribuicao',
  visitadoTioVisitacao: 'Visitado pelo tio da visitacao',
  desistiu: 'Desistiu?',
  restricaoMedicamentosa: 'Restricao medicamentosa',
  tipoRestricaoMedicamentosa: 'Se sim, qual restricao medicamentosa?',
};

const READ_FIELDS = [
  'nome',
  'email',
  'status',
  'dataCadastro',
  'telefone',
  'localidade',
  'dataNascimento',
  'idade',
  'sexo',
  'tamanhoCamisa',
  'alergico',
  'tipoAlergia',
  'nomeSocial',
  'celular',
  'nomePai',
  'nomeMae',
  'enderecoCompleto',
  'cidade',
  'estado',
  'escola',
  'turno',
  'serie',
  'grau',
  'jaParticipouEncontro',
  'qualEncontroAnterior',
  'paisFizeramECC',
  'batizado',
  'primeiraComunhao',
  'crismado',
  'tocaInstrumento',
  'gostaCantar',
  'familiaOutraDoutrina',
  'quemConvidouEac',
  'paroquia',
  'motivoEncontro',
  'valorContribuicao',
  'visitadoTioVisitacao',
  'desistiu',
  'restricaoMedicamentosa',
  'tipoRestricaoMedicamentosa',
];

const UPDATE_FIELDS = [
  'nome',
  'email',
  'status',
  'telefone',
  'localidade',
  'dataNascimento',
  'idade',
  'tamanhoCamisa',
  'alergico',
  'tipoAlergia',
  'nomeSocial',
  'celular',
  'nomePai',
  'nomeMae',
  'enderecoCompleto',
  'cidade',
  'estado',
  'escola',
  'turno',
  'serie',
  'grau',
  'jaParticipouEncontro',
  'qualEncontroAnterior',
  'paisFizeramECC',
  'batizado',
  'primeiraComunhao',
  'crismado',
  'tocaInstrumento',
  'gostaCantar',
  'familiaOutraDoutrina',
  'quemConvidouEac',
  'paroquia',
  'motivoEncontro',
  'valorContribuicao',
  'visitadoTioVisitacao',
  'desistiu',
  'restricaoMedicamentosa',
  'tipoRestricaoMedicamentosa',
];

function getSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    throw new Error('Aba nao encontrada: ' + SHEET_NAME);
  }

  return sheet;
}

function formatDateBR(value) {
  if (!value) return '';
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value)) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'dd/MM/yyyy');
  }
  return String(value);
}

function sanitizeYesNo(value) {
  const normalized = String(value || '').trim().toUpperCase();
  if (normalized === 'SIM' || normalized === 'NAO') return normalized;
  return '';
}

function getExpectedHeadersByColumn_() {
  const maxIndex = Object.keys(COL).reduce(function (acc, key) {
    return Math.max(acc, COL[key]);
  }, 0);

  const headers = new Array(maxIndex + 1).fill('');
  Object.keys(COL).forEach(function (key) {
    headers[COL[key]] = HEADER_BY_KEY[key] || '';
  });
  return headers;
}

function ensureInscricoesHeaders() {
  const sheet = getSheet();
  const expected = getExpectedHeadersByColumn_();
  const requiredColumns = expected.length;
  const currentMaxColumns = sheet.getMaxColumns();

  if (currentMaxColumns < requiredColumns) {
    sheet.insertColumnsAfter(currentMaxColumns, requiredColumns - currentMaxColumns);
  }

  const current = sheet.getRange(1, 1, 1, requiredColumns).getValues()[0];
  const changes = [];

  expected.forEach(function (expectedHeader, idx) {
    if (!expectedHeader) return;
    const previous = String(current[idx] || '').trim();
    if (previous !== expectedHeader) {
      changes.push({
        coluna: toColumnLetter(idx + 1),
        de: previous,
        para: expectedHeader,
      });
      current[idx] = expectedHeader;
    }
  });

  if (changes.length > 0) {
    sheet.getRange(1, 1, 1, requiredColumns).setValues([current]);
  }

  Logger.log(JSON.stringify({
    success: true,
    sheet: SHEET_NAME,
    requiredColumns: requiredColumns,
    changedHeaders: changes.length,
    changes: changes,
  }));

  return {
    success: true,
    sheet: SHEET_NAME,
    requiredColumns: requiredColumns,
    changedHeaders: changes.length,
    changes: changes,
  };
}

function validateOperationalSetup() {
  const sheet = getSheet();
  const expected = getExpectedHeadersByColumn_();
  const requiredColumns = expected.length;
  const maxColumns = sheet.getMaxColumns();
  const readableColumns = Math.max(Math.min(maxColumns, requiredColumns), 1);
  const headers = sheet.getRange(1, 1, 1, readableColumns).getValues()[0];

  const fieldKeys = Object.keys(COL);
  const duplicateCols = [];
  const seen = {};
  fieldKeys.forEach(function (key) {
    const idx = COL[key];
    if (seen[idx] !== undefined) {
      duplicateCols.push({ colunaIndice: idx, campoA: seen[idx], campoB: key });
      return;
    }
    seen[idx] = key;
  });

  const missingHeaderMapping = fieldKeys.filter(function (key) {
    return !HEADER_BY_KEY[key];
  });

  const missingColMappingForRead = READ_FIELDS.filter(function (key) {
    return COL[key] === undefined;
  });

  const missingColMappingForUpdate = UPDATE_FIELDS.filter(function (key) {
    return COL[key] === undefined;
  });

  const headerMismatch = [];
  expected.forEach(function (expectedHeader, idx) {
    if (!expectedHeader) return;
    const currentHeader = idx < headers.length ? String(headers[idx] || '').trim() : '';
    if (currentHeader !== expectedHeader) {
      headerMismatch.push({
        coluna: toColumnLetter(idx + 1),
        esperado: expectedHeader,
        atual: currentHeader,
      });
    }
  });

  const result = {
    success:
      duplicateCols.length === 0 &&
      missingHeaderMapping.length === 0 &&
      missingColMappingForRead.length === 0 &&
      missingColMappingForUpdate.length === 0 &&
      maxColumns >= requiredColumns &&
      headerMismatch.length === 0,
    sheet: SHEET_NAME,
    maxColumns: maxColumns,
    requiredColumns: requiredColumns,
    duplicateCols: duplicateCols,
    missingHeaderMapping: missingHeaderMapping,
    missingColMappingForRead: missingColMappingForRead,
    missingColMappingForUpdate: missingColMappingForUpdate,
    headerMismatch: headerMismatch,
  };

  Logger.log(JSON.stringify(result));
  return result;
}

function setupAndValidateInscricoesSheet() {
  const setup = ensureInscricoesHeaders();
  const validation = validateOperationalSetup();

  const result = {
    setup: setup,
    validation: validation,
  };

  Logger.log(JSON.stringify(result));
  return result;
}

function doGet(e) {
  try {
    const action = String((e && e.parameter && e.parameter.action) || 'read');
    if (action !== 'read') {
      return jsonResponse({ error: 'Acao invalida' });
    }

    const q = String((e && e.parameter && e.parameter.q) || '').toLowerCase().trim();
    const sheet = getSheet();
    const rows = sheet.getDataRange().getValues();

    if (!rows || rows.length <= 1) {
      return jsonResponse([]);
    }

    const data = rows
      .slice(1)
      .map(function (row, idx) {
        return {
          rowIndex: idx + 2,
          nome: String(row[COL.nome] || ''),
          email: String(row[COL.email] || ''),
          status: String(row[COL.status] || ''),
          dataCadastro: formatDateBR(row[COL.dataCadastro]),
          telefone: String(row[COL.telefone] || ''),
          localidade: String(row[COL.localidade] || ''),
          dataNascimento: formatDateBR(row[COL.dataNascimento]),
          idade: String(row[COL.idade] || ''),
          sexo: String(row[COL.sexo] || ''),
          tamanhoCamisa: String(row[COL.tamanhoCamisa] || ''),
          alergico: String(row[COL.alergico] || ''),
          tipoAlergia: String(row[COL.tipoAlergia] || ''),
          nomeSocial: String(row[COL.nomeSocial] || ''),
          celular: String(row[COL.celular] || ''),
          nomePai: String(row[COL.nomePai] || ''),
          nomeMae: String(row[COL.nomeMae] || ''),
          enderecoCompleto: String(row[COL.enderecoCompleto] || ''),
          cidade: String(row[COL.cidade] || ''),
          estado: String(row[COL.estado] || ''),
          escola: String(row[COL.escola] || ''),
          turno: String(row[COL.turno] || ''),
          serie: String(row[COL.serie] || ''),
          grau: String(row[COL.grau] || ''),
          jaParticipouEncontro: sanitizeYesNo(row[COL.jaParticipouEncontro]),
          qualEncontroAnterior: String(row[COL.qualEncontroAnterior] || ''),
          paisFizeramECC: sanitizeYesNo(row[COL.paisFizeramECC]),
          batizado: sanitizeYesNo(row[COL.batizado]),
          primeiraComunhao: sanitizeYesNo(row[COL.primeiraComunhao]),
          crismado: sanitizeYesNo(row[COL.crismado]),
          tocaInstrumento: sanitizeYesNo(row[COL.tocaInstrumento]),
          gostaCantar: sanitizeYesNo(row[COL.gostaCantar]),
          familiaOutraDoutrina: sanitizeYesNo(row[COL.familiaOutraDoutrina]),
          quemConvidouEac: String(row[COL.quemConvidouEac] || ''),
          paroquia: String(row[COL.paroquia] || ''),
          motivoEncontro: String(row[COL.motivoEncontro] || ''),
          valorContribuicao: String(row[COL.valorContribuicao] || ''),
          visitadoTioVisitacao: sanitizeYesNo(row[COL.visitadoTioVisitacao]),
          desistiu: sanitizeYesNo(row[COL.desistiu]),
          restricaoMedicamentosa: sanitizeYesNo(row[COL.restricaoMedicamentosa]),
          tipoRestricaoMedicamentosa: String(row[COL.tipoRestricaoMedicamentosa] || ''),
        };
      })
      .filter(function (item) {
        return item.nome;
      });

    const filtered = q
      ? data.filter(function (item) {
          return (
            item.nome.toLowerCase().indexOf(q) !== -1 ||
            item.email.toLowerCase().indexOf(q) !== -1 ||
            item.telefone.toLowerCase().indexOf(q) !== -1
          );
        })
      : data;

    return jsonResponse(filtered);
  } catch (err) {
    return jsonResponse({ error: true, message: String(err) });
  }
}

function doPost(e) {
  try {
    const payload = JSON.parse((e.postData && e.postData.contents) || '{}');

    if (payload.action !== 'update') {
      return jsonResponse({ error: 'Acao invalida' });
    }

    const rowIndex = Number(payload.rowIndex);
    const data = payload.data || {};
    const notifyResponsavel = Boolean(payload.notifyResponsavel);

    if (!rowIndex || rowIndex < 2) {
      return jsonResponse({ error: 'rowIndex invalido' });
    }

    const sheet = getSheet();
    if (data.alergico !== undefined) {
      data.alergico = sanitizeYesNo(data.alergico);
    }

    const desistiuValue = sanitizeYesNo(data.desistiu);
    if (data.desistiu !== undefined) {
      data.desistiu = desistiuValue;
      if (desistiuValue === 'SIM') {
        data.status = 'Nao confirmado';
      }
    }

    if (data.restricaoMedicamentosa !== undefined) {
      data.restricaoMedicamentosa = sanitizeYesNo(data.restricaoMedicamentosa);
    }

    if (data.alergico === 'SIM' && !String(data.tipoAlergia || '').trim()) {
      return jsonResponse({ error: true, message: 'Preencha o detalhe da restricao alimentar.' });
    }

    if (data.restricaoMedicamentosa === 'SIM' && !String(data.tipoRestricaoMedicamentosa || '').trim()) {
      return jsonResponse({ error: true, message: 'Preencha o detalhe da restricao medicamentosa.' });
    }

    const updatableCols = {
      nome: COL.nome,
      email: COL.email,
      status: COL.status,
      telefone: COL.telefone,
      localidade: COL.localidade,
      dataNascimento: COL.dataNascimento,
      idade: COL.idade,
      tamanhoCamisa: COL.tamanhoCamisa,
      alergico: COL.alergico,
      tipoAlergia: COL.tipoAlergia,
      nomeSocial: COL.nomeSocial,
      celular: COL.celular,
      nomePai: COL.nomePai,
      nomeMae: COL.nomeMae,
      enderecoCompleto: COL.enderecoCompleto,
      cidade: COL.cidade,
      estado: COL.estado,
      escola: COL.escola,
      turno: COL.turno,
      serie: COL.serie,
      grau: COL.grau,
      jaParticipouEncontro: COL.jaParticipouEncontro,
      qualEncontroAnterior: COL.qualEncontroAnterior,
      paisFizeramECC: COL.paisFizeramECC,
      batizado: COL.batizado,
      primeiraComunhao: COL.primeiraComunhao,
      crismado: COL.crismado,
      tocaInstrumento: COL.tocaInstrumento,
      gostaCantar: COL.gostaCantar,
      familiaOutraDoutrina: COL.familiaOutraDoutrina,
      quemConvidouEac: COL.quemConvidouEac,
      paroquia: COL.paroquia,
      motivoEncontro: COL.motivoEncontro,
      valorContribuicao: COL.valorContribuicao,
      visitadoTioVisitacao: COL.visitadoTioVisitacao,
      desistiu: COL.desistiu,
      restricaoMedicamentosa: COL.restricaoMedicamentosa,
      tipoRestricaoMedicamentosa: COL.tipoRestricaoMedicamentosa,
    };

    Object.keys(updatableCols).forEach(function (key) {
      if (data[key] !== undefined) {
        sheet.getRange(rowIndex, updatableCols[key] + 1).setValue(data[key]);
      }
    });

    if (notifyResponsavel) {
      sendResponsavelEmail(sheet, rowIndex, data);
    }

    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse({ error: true, message: String(err) });
  }
}

function sendResponsavelEmail(sheet, rowIndex, incomingData) {
  const currentEmail = String(sheet.getRange(rowIndex, COL.email + 1).getValue() || '').trim();
  const currentNome = String(sheet.getRange(rowIndex, COL.nome + 1).getValue() || '').trim();

  const targetEmail = String((incomingData && incomingData.email) || currentEmail || '').trim();
  const nomeAdolescente = String((incomingData && incomingData.nome) || currentNome || '').trim() || 'adolescente';

  if (!targetEmail) {
    throw new Error('Nao foi possivel enviar e-mail: e-mail do responsavel nao informado.');
  }

  const logoUrl = 'https://i.imgur.com/c5XQ7TW.jpeg';
  const instagramUrl = 'https://www.instagram.com/eacporciunculadesantana/';
  const subject = 'EAC - Confirmacao de visitacao e recebimento da ficha';

  const htmlBody =
    '<div style="font-family:Arial,Helvetica,sans-serif;background:#f3f4f6;padding:24px;">' +
      '<div style="max-width:760px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;">' +
        '<div style="background:#0b4a7d;padding:28px 24px;text-align:center;">' +
          '<img src="' + logoUrl + '" alt="EAC" style="max-width:96px;height:auto;border-radius:50%;" />' +
        '</div>' +
        '<div style="padding:28px 36px;color:#1f2937;line-height:1.6;font-size:22px;">' +
          '<p style="margin:0 0 16px;">Ola, ' + escapeHtml(nomeAdolescente) + '. Paz e bem.</p>' +
          '<p style="margin:0 0 16px;">Passando para agradecer pela sua acolhida durante a visitacao e confirmar o recebimento da sua ficha de inscricao para o EAC.</p>' +
          '<p style="margin:0 0 16px;">Ficamos muito felizes com o seu interesse em participar desse encontro tao especial. Sua presenca e muito importante para nos.</p>' +
          '<p style="margin:0 0 16px;">Em breve, entraremos em contato com mais informacoes sobre os proximos passos, orientacoes e tudo o que voce precisa saber.</p>' +
          '<p style="margin:0 0 16px;">Qualquer duvida, estamos a disposicao.</p>' +
          '<p style="margin:0 0 24px;">Deus abencoe voce e sua familia.<br/>Equipe EAC</p>' +
          '<div style="text-align:center;">' +
            '<a href="' + instagramUrl + '" style="display:inline-block;padding:12px 18px;background:#0b4a7d;color:#ffffff;text-decoration:none;font-weight:bold;border-radius:8px;">SIGA NOSSO INSTAGRAM</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  const textBody =
    'Ola, ' + nomeAdolescente + '. Paz e bem.\n\n' +
    'Passando para agradecer pela sua acolhida durante a visitacao e confirmar o recebimento da sua ficha de inscricao para o EAC.\n\n' +
    'Ficamos muito felizes com o seu interesse em participar desse encontro tao especial. Sua presenca e muito importante para nos.\n\n' +
    'Em breve, entraremos em contato com mais informacoes sobre os proximos passos, orientacoes e tudo o que voce precisa saber.\n\n' +
    'Qualquer duvida, estamos a disposicao.\n\n' +
    'Deus abencoe voce e sua familia.\nEquipe EAC\n' +
    instagramUrl;

  MailApp.sendEmail({
    to: targetEmail,
    subject: subject,
    htmlBody: htmlBody,
    body: textBody,
    name: 'Equipe EAC',
  });
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function logHeaders() {
  const sheet = getSheet();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  headers.forEach(function (h, i) {
    const colLetter = toColumnLetter(i + 1);
    Logger.log(i + ' (col ' + colLetter + '): ' + h);
  });
}

function toColumnLetter(colNumber) {
  let temp = '';
  let letter = '';

  while (colNumber > 0) {
    temp = (colNumber - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    colNumber = (colNumber - temp - 1) / 26;
  }

  return letter;
}
