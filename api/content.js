import { head, put } from '@vercel/blob'
import { defaultContent } from '../src/data/defaultContent.js'

const CONTENT_PATH = 'site-content/content.json'

async function readContentFromBlob() {
  try {
    const blob = await head(CONTENT_PATH)
    const response = await fetch(blob.url, { cache: 'no-store' })
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

export async function GET() {
  const items = await readContentFromBlob()
  return Response.json({ items })
}

export async function PUT(request) {
  const body = await request.json()
  const items = Array.isArray(body?.items) ? body.items : []

  if (items.length === 0) {
    return new Response('Envie um array valido em items.', { status: 400 })
  }

  const savedItems = await saveContentToBlob(items)
  return Response.json({ items: savedItems })
}
