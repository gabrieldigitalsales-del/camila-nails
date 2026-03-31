import { put } from '@vercel/blob'
import { defaultContent } from '../src/data/defaultContent.js'

const CONTENT_PATH = 'site-content/content.json'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Metodo nao permitido.')
  }

  try {
    await put(CONTENT_PATH, JSON.stringify(defaultContent, null, 2), {
      access: 'public',
      allowOverwrite: true,
      addRandomSuffix: false,
      contentType: 'application/json; charset=utf-8',
      cacheControlMaxAge: 0,
    })

    return res.status(200).json({ items: defaultContent })
  } catch (error) {
    return res.status(500).send(error?.message || 'Erro ao resetar conteudo.')
  }
}
