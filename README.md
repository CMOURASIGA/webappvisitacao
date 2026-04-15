# Webapp Novos adolescentes (EAC)

Frontend React + TypeScript + Vite para leitura e edicao de registros da aba `Inscricoes_Prioritarias` via Google Apps Script Web App.

## Requisitos

- Node.js 20+
- URL de implantacao do Apps Script Web App

## Configuracao local

1. Instale dependencias:
   `npm install`
2. Crie o arquivo `.env.local`:
   `copy .env.local.example .env.local`
3. Defina `VITE_APPS_SCRIPT_URL_LOCAL` com sua URL de validacao do Apps Script.
4. Rode em desenvolvimento:
   `npm run dev`

## Variaveis de ambiente

- `VITE_APPS_SCRIPT_URL_LOCAL`: URL do Apps Script para validacao local (usada no `npm run dev`).
- `VITE_APPS_SCRIPT_URL`: URL do Apps Script para producao (configure no Vercel).
- `VITE_API_URL`: fallback legado (opcional).

## Vercel

No painel da Vercel, configure em **Project Settings > Environment Variables**:

- Nome: `VITE_APPS_SCRIPT_URL`
- Valor: `https://script.google.com/macros/s/SEU_DEPLOY_ID_PROD/exec`
- Ambientes: `Production` (e `Preview`, se quiser)

## Apps Script

Arquivo pronto para colar/publicar:

- `apps-script/Codigo.gs`

## Build

- `npm run build`
- `npm run preview`
