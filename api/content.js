import { ensureBlobToken, getJsonContent, json, saveJsonContent } from './_lib/blobStore.js'

export async function GET() {
  try {
    await ensureBlobToken()
    const { items, access, initialized } = await getJsonContent()
    return json({ items, mode: 'blob', access, initialized })
  } catch (error) {
    return json({ error: error?.message || 'Erro interno ao carregar conteudo.' }, 500)
  }
}

export async function PUT(request) {
  try {
    await ensureBlobToken()

    const body = await request.json()
    const items = Array.isArray(body?.items) ? body.items : null

    if (!items || items.length === 0) {
      return json({ error: 'Envie um array valido em items.' }, 400)
    }

    const saved = await saveJsonContent(items)
    return json({ items: saved.items, mode: 'blob', access: saved.access, pathname: saved.blob.pathname })
  } catch (error) {
    return json({ error: error?.message || 'Erro interno ao salvar conteudo.' }, 500)
  }
}
