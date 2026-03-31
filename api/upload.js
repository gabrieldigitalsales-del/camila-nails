import { put } from '@vercel/blob'

export const config = {
  api: {
    bodyParser: false,
  },
}

function sanitizeFilename(filename = 'arquivo') {
  return filename
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo nao permitido.' })
  }

  try {
    const rawName = typeof req.query.filename === 'string' ? req.query.filename : 'imagem'
    const safeName = sanitizeFilename(rawName)

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(500).json({ error: 'BLOB_READ_WRITE_TOKEN nao configurado no projeto.' })
    }

    if (!safeName) {
      return res.status(400).json({ error: 'Nome do arquivo invalido.' })
    }

    const pathname = `uploads/${Date.now()}-${safeName}`
    const blob = await put(pathname, req, {
      access: 'public',
      addRandomSuffix: true,
      contentType: req.headers['content-type'] || 'application/octet-stream',
      cacheControlMaxAge: 0,
    })

    return res.status(200).json({
      url: blob.url,
      pathname: blob.pathname,
    })
  } catch (error) {
    return res.status(500).json({
      error: error?.message || 'Erro ao enviar imagem.',
    })
  }
}
