# Camila Almeida - site pronto para Vercel com persistencia online

Esta versao foi refeita para manter o site na Vercel sem Base44 e sem banco externo separado.

## Arquitetura recomendada

- Front-end React + Vite
- API serverless em `/api`
- Vercel Blob para:
  - imagens enviadas pelo admin
  - JSON central com todo o conteudo editavel do site

Com isso, quando voce editar textos, servicos, valores e imagens no `/admin`, o conteudo fica salvo online e aparece igual em outros dispositivos.

## Como rodar localmente

### Modo completo (frontend + API da Vercel)

1. Instale as dependencias:

```bash
npm install
```

2. Conecte o projeto a Vercel e puxe as variaveis:

```bash
vercel link
vercel env pull .env.local
```

3. Rode localmente:

```bash
npm run dev
```

### Modo somente frontend

Se voce quiser apenas visualizar o layout sem API da Vercel:

```bash
npm install
npm run dev:frontend
```

Nesse modo o projeto usa fallback local no navegador.

## Deploy na Vercel

1. Suba o projeto para GitHub
2. Importe o repositorio na Vercel
3. No projeto da Vercel, crie um Blob Store publico
4. Confirme que a variavel `BLOB_READ_WRITE_TOKEN` foi adicionada ao projeto
5. Faça o deploy

## Rotas

- Site: `/`
- Admin: `/admin`

## Observacoes importantes

- O admin salva online quando a API estiver disponivel
- Se a API nao responder, o projeto ainda funciona com fallback local
- Upload server-side e ideal para imagens comuns do site; para arquivos muito grandes, use upload client-side em uma proxima iteracao
- Esta versao nao inclui login no admin


## Scripts

- `npm run dev`: roda o front local com Vite
- `npm run dev:vercel`: roda o projeto via Vercel CLI, se você quiser testar as rotas `/api` localmente


## Ajuste aplicado em 2026-03-31

O upload de imagem foi ajustado para o formato recomendado pela Vercel Blob em rotas `/api`: o arquivo vai direto no `body` da requisicao e o nome do arquivo segue por query string (`/api/upload?filename=...`).
