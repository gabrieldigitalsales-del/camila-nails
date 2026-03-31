import { put } from '@vercel/blob'
import { defaultContent } from '../src/data/defaultContent.js'

const CONTENT_PATH = 'site-content/content.json'

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo nao permitido.' })
  }

  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(500).json({ error: 'BLOB_READ_WRITE_TOKEN nao configurado no projeto.' })
    }

    await put(CONTENT_PATH, JSON.stringify(defaultContent, null, 2), {
      access: 'public',
      allowOverwrite: true,
      addRandomSuffix: false,
      contentType: 'application/json; charset=utf-8',
      cacheControlMaxAge: 0,
    })

    return res.status(200).json({ items: defaultContent, mode: 'blob' })
  } catch (error) {
    return res.status(500).json({ error: error?.message || 'Erro ao restaurar conteudo.' })
  }
}
