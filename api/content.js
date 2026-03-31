import { head, put } from '@vercel/blob'
import { defaultContent } from '../src/data/defaultContent.js'

const CONTENT_PATH = 'site-content/content.json'

async function readContentFromBlob() {
  try {
    const blob = await head(CONTENT_PATH)
    const response = await fetch(`${blob.url}?ts=${Date.now()}`, { cache: 'no-store' })
    if (!response.ok) throw new Error('Falha ao ler o JSON salvo.')
    const data = await response.json()
    return Array.isArray(data) ? data : defaultContent
  } catch {
    return defaultContent
  }
}

async function saveContentToBlob(items) {
  await put(CONTENT_PATH, JSON.stringify(items, null, 2), {
    access: 'public',
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: 'application/json; charset=utf-8',
    cacheControlMaxAge: 0,
  })
  return items
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(500).json({ error: 'BLOB_READ_WRITE_TOKEN nao configurado no projeto.' })
    }

    if (req.method === 'GET') {
      const items = await readContentFromBlob()
      return res.status(200).json({ items, mode: 'blob' })
    }

    if (req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      const items = Array.isArray(body?.items) ? body.items : []
      if (items.length === 0) {
        return res.status(400).json({ error: 'Envie um array valido em items.' })
      }
      const savedItems = await saveContentToBlob(items)
      return res.status(200).json({ items: savedItems, mode: 'blob' })
    }

    return res.status(405).json({ error: 'Metodo nao permitido.' })
  } catch (error) {
    return res.status(500).json({ error: error?.message || 'Erro interno ao salvar conteudo.' })
  }
}
