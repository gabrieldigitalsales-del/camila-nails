# Camila Almeida - site pronto para Vercel com persistencia online

Esta versao foi refeita para manter o site na Vercel sem Base44 e sem banco externo separado.

## Arquitetura

- Front-end React + Vite
- API serverless em `/api`
- Vercel Blob para:
  - imagens enviadas pelo admin
  - JSON central com todo o conteudo editavel do site

Com isso, quando voce editar textos, servicos, valores e imagens no `/admin`, o conteudo fica salvo online e aparece igual em outros dispositivos.

## Como rodar localmente

### Interface apenas

```bash
npm install
npm run dev
```

### Interface + API da Vercel + Blob

```bash
npm install
vercel link
vercel env pull .env.local
npm run dev:vercel
```

## Deploy na Vercel

1. Suba o projeto para GitHub
2. Importe o repositorio na Vercel
3. No projeto da Vercel, crie um Blob Store publico
4. Confirme que a variavel `BLOB_READ_WRITE_TOKEN` foi adicionada ao projeto
5. Faça o deploy

## Rotas

- Site: `/`
- Admin: `/admin`

## Observacoes importantes desta versao

- O painel admin nao usa fallback em localStorage para salvar.
- Se a API falhar, o admin mostra erro real em vez de fingir que salvou.
- O upload de imagem usa envio direto do arquivo para `/api/upload?filename=...`, no formato esperado pela Vercel Blob.
- Para testar localmente com API e Blob, use `npm run dev:vercel`.
- Ao remover uma imagem no admin, o site deixa de exibi-la imediatamente apos salvar o JSON online.
