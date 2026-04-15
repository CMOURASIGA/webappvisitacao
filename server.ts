import express from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Google Sheets API Setup
// Em produção, as credenciais devem vir de variáveis de ambiente
// Para o preview, vamos usar um mock se as credenciais não estiverem configuradas
const SPREADSHEET_ID = '1I988yRvGYfjhoqmFvdQbjO9qWzTB4T6yv0dDBxQ-oEg';
const SHEET_NAME = 'Inscricoes_Prioritarias';

// Helper to get Google Sheets client
const getSheetsClient = () => {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    return null;
  }
  
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
};

// Mock data for preview when credentials are not available
let mockData = [
  { rowIndex: 2, dataCadastro: '10/04/2026 10:00:00', nome: 'João Silva', localidade: 'Centro', idade: '16', status: 'Pendente', tamanhoCamisa: '', alergico: '', tipoAlergia: '', nomeSocial: '' },
  { rowIndex: 3, dataCadastro: '11/04/2026 14:30:00', nome: 'Maria Souza', localidade: 'Bairro Alto', idade: '15', status: 'Confirmado', tamanhoCamisa: 'M', alergico: 'NAO', tipoAlergia: 'Nenhuma', nomeSocial: 'Maria' },
  { rowIndex: 4, dataCadastro: '12/04/2026 09:15:00', nome: 'Pedro Santos', localidade: 'Vila Nova', idade: '17', status: 'Pendente', tamanhoCamisa: '', alergico: '', tipoAlergia: '', nomeSocial: '' },
];

// API Routes
app.get('/api/inscricoes', async (req, res) => {
  try {
    const query = req.query.q?.toString().toLowerCase();
    const sheets = getSheetsClient();
    
    if (!sheets) {
      // Return mock data if no credentials
      console.log('Using mock data (no Google credentials found)');
      let data = mockData;
      if (query) {
        data = mockData.filter(item => 
          item.nome.toLowerCase().includes(query) ||
          item.localidade.toLowerCase().includes(query) ||
          item.dataCadastro.toLowerCase().includes(query)
        );
      }
      return res.json(data);
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:Z`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.json([]);
    }

    // Assume header is row 1 (index 0)
    const headers = rows[0];
    
    // Map rows to objects, keeping track of original row index (1-based for Sheets, so index + 1)
    const mappedData = rows.slice(1).map((row, index) => {
      const getCol = (name: string, defaultIdx: number) => {
        const idx = headers.findIndex(h => h.toLowerCase().includes(name.toLowerCase()));
        return idx !== -1 ? idx : defaultIdx;
      };

      const idxData = getCol('data', 0);
      const idxNome = getCol('nome', 1);
      const idxLocalidade = getCol('localidade', 4);
      const idxIdade = getCol('idade', 2);
      const idxStatus = getCol('status', 5);
      
      // Novas colunas
      const idxCamisa = getCol('camisa', 20);
      const idxAlergico = getCol('alérgico', 21);
      const idxTipoAlergia = getCol('tipo de alergia', 22);
      const idxNomeSocial = getCol('nome social', 23);

      return {
        rowIndex: index + 2, // +2 because row 1 is header, and array is 0-indexed
        dataCadastro: row[idxData] || '',
        nome: row[idxNome] || '',
        localidade: row[idxLocalidade] || '',
        idade: row[idxIdade] || '',
        status: row[idxStatus] || '',
        tamanhoCamisa: row[idxCamisa] || '',
        alergico: row[idxAlergico] || '',
        tipoAlergia: row[idxTipoAlergia] || '',
        nomeSocial: row[idxNomeSocial] || '',
        _raw: row // Keep raw row for updates
      };
    });

    let filteredData = mappedData;
    if (query) {
      filteredData = mappedData.filter(item => 
        item.nome.toLowerCase().includes(query) ||
        item.localidade.toLowerCase().includes(query) ||
        item.dataCadastro.toLowerCase().includes(query)
      );
    }

    res.json(filteredData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data from Google Sheets' });
  }
});

app.put('/api/inscricoes/:rowIndex', async (req, res) => {
  const rowIndex = parseInt(req.params.rowIndex);
  const updateData = req.body;

  try {
    const sheets = getSheetsClient();
    
    if (!sheets) {
      // Update mock data
      const index = mockData.findIndex(m => m.rowIndex === rowIndex);
      if (index !== -1) {
        mockData[index] = { ...mockData[index], ...updateData };
        return res.json({ success: true, data: mockData[index] });
      }
      return res.status(404).json({ error: 'Row not found in mock data' });
    }

    // First, get the headers to know where to put the new data
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:Z1`,
    });
    
    let headers = headerResponse.data.values?.[0] || [];
    
    // Define the columns we need to update
    const columnsToUpdate = [
      { key: 'nome', label: 'Nome' },
      { key: 'idade', label: 'Idade' },
      { key: 'localidade', label: 'Localidade' },
      { key: 'status', label: 'Status' },
      { key: 'tamanhoCamisa', label: 'Tamanho de Camisa' },
      { key: 'alergico', label: 'É Alérgico' },
      { key: 'tipoAlergia', label: 'Qual tipo de alergia' },
      { key: 'nomeSocial', label: 'Nome Social' }
    ];

    // Check if we need to add headers
    let headersUpdated = false;
    columnsToUpdate.forEach(col => {
      if (!headers.includes(col.label)) {
        headers.push(col.label);
        headersUpdated = true;
      }
    });

    if (headersUpdated) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1:Z1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [headers]
        }
      });
    }

    // Get the current row data to preserve existing columns
    const rowResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A${rowIndex}:Z${rowIndex}`,
    });

    let rowData = rowResponse.data.values?.[0] || [];
    
    // Pad rowData to match headers length
    while (rowData.length < headers.length) {
      rowData.push('');
    }

    // Update the specific columns
    columnsToUpdate.forEach(col => {
      const colIndex = headers.indexOf(col.label);
      if (colIndex !== -1 && updateData[col.key] !== undefined) {
        rowData[colIndex] = updateData[col.key];
      }
    });

    // Write back the row
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A${rowIndex}:Z${rowIndex}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rowData]
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ error: 'Failed to update data in Google Sheets' });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
