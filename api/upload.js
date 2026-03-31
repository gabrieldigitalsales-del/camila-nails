import { put } from '@vercel/blob'

function sanitizeFilename(filename = 'arquivo') {
  return filename
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
}

export async function POST(request) {
  const form = await request.formData()
  const file = form.get('file')

  if (!(file instanceof File)) {
    return new Response('Arquivo nao enviado.', { status: 400 })
  }

  const pathname = `uploads/${Date.now()}-${sanitizeFilename(file.name)}`
  const blob = await put(pathname, file, {
    access: 'public',
    addRandomSuffix: true,
  })

  return Response.json({
    url: blob.url,
    pathname: blob.pathname,
  })
}
