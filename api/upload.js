import { put } from '@vercel/blob'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb',
    },
  },
}

function sanitizeFilename(filename = 'arquivo') {
  return filename
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Metodo nao permitido.')
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const fileName = body?.fileName
    const contentType = body?.contentType || 'application/octet-stream'
    const base64 = body?.base64

    if (!fileName || !base64) {
      return res.status(400).send('Arquivo nao enviado.')
    }

    const pathname = `uploads/${Date.now()}-${sanitizeFilename(fileName)}`
    const buffer = Buffer.from(base64, 'base64')

    const blob = await put(pathname, buffer, {
      access: 'public',
      addRandomSuffix: true,
      contentType,
      cacheControlMaxAge: 0,
    })

    return res.status(200).json({
      url: blob.url,
      pathname: blob.pathname,
    })
  } catch (error) {
    return res.status(500).send(error?.message || 'Erro ao enviar imagem.')
  }
}
