import { put } from '@vercel/blob'

function sanitizeFilename(filename = 'arquivo') {
  return filename
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
}

export const runtime = 'nodejs'

export async function POST(request) {
  const { searchParams } = new URL(request.url)
  const rawFilename = searchParams.get('filename') || 'arquivo'
  const filename = sanitizeFilename(rawFilename)

  if (!request.body) {
    return new Response('Arquivo nao enviado.', { status: 400 })
  }

  const pathname = `uploads/${Date.now()}-${filename}`
  const blob = await put(pathname, request.body, {
    access: 'public',
    addRandomSuffix: true,
  })

  return Response.json({
    url: blob.url,
    pathname: blob.pathname,
  })
}
