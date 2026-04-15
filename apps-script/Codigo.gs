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
};

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

    if (!rowIndex || rowIndex < 2) {
      return jsonResponse({ error: 'rowIndex invalido' });
    }

    const sheet = getSheet();

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
    };

    Object.keys(updatableCols).forEach(function (key) {
      if (data[key] !== undefined) {
        sheet.getRange(rowIndex, updatableCols[key] + 1).setValue(data[key]);
      }
    });

    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse({ error: true, message: String(err) });
  }
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
