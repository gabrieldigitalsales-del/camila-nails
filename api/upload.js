import { requireAdmin } from './_lib/auth.js'
import { ensureBlobToken, json, putWithDetectedAccess } from './_lib/blobStore.js'

function sanitizeFilename(filename = 'arquivo') {
  return filename
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

export async function POST(request) {
  const authError = requireAdmin(request)
  if (authError) return authError
  try {
    await ensureBlobToken()

    const url = new URL(request.url)
    const rawName = url.searchParams.get('filename') || 'imagem'
    const safeName = sanitizeFilename(rawName)

    if (!safeName) {
      return json({ error: 'Nome do arquivo invalido.' }, 400)
    }

    const type = request.headers.get('content-type') || 'application/octet-stream'
    const arrayBuffer = await request.arrayBuffer()

    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      return json({ error: 'Arquivo vazio.' }, 400)
    }

    const pathname = `uploads/${Date.now()}-${safeName}`
    const { blob, access } = await putWithDetectedAccess(pathname, arrayBuffer, {
      addRandomSuffix: true,
      contentType: type,
      cacheControlMaxAge: 0,
    })

    return json({ url: blob.url, pathname: blob.pathname, access })
  } catch (error) {
    return json({ error: error?.message || 'Erro ao enviar imagem.' }, 500)
  }
}
