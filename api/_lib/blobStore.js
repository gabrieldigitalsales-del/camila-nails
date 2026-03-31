import { get, put } from '@vercel/blob'
import { defaultContent } from '../../src/data/defaultContent.js'

export const CONTENT_PATH = 'site-content/content.json'

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}

export function getBlobAccessCandidates() {
  const configured = (process.env.BLOB_STORE_ACCESS || '').trim().toLowerCase()
  if (configured === 'private') return ['private']
  if (configured === 'public') return ['public']
  return ['public', 'private']
}

export async function putWithDetectedAccess(pathname, body, options = {}) {
  let lastError
  for (const access of getBlobAccessCandidates()) {
    try {
      const blob = await put(pathname, body, {
        access,
        ...options,
      })
      return { blob, access }
    } catch (error) {
      lastError = error
    }
  }
  throw lastError || new Error('Nao foi possivel gravar no Blob.')
}

export async function getJsonContent() {
  let lastError
  for (const access of getBlobAccessCandidates()) {
    try {
      const result = await get(CONTENT_PATH, { access })
      if (!result || result.statusCode === 404 || !result.stream) {
        return { items: defaultContent, access, initialized: false }
      }

      const text = await new Response(result.stream).text()
      const parsed = JSON.parse(text)
      if (!Array.isArray(parsed)) {
        throw new Error('O JSON salvo no Blob esta invalido.')
      }
      return { items: parsed, access, initialized: true }
    } catch (error) {
      lastError = error
    }
  }

  if (lastError?.message?.toLowerCase?.().includes('not found')) {
    return { items: defaultContent, access: getBlobAccessCandidates()[0], initialized: false }
  }

  throw lastError || new Error('Nao foi possivel ler o conteudo salvo.')
}

export async function saveJsonContent(items) {
  const { blob, access } = await putWithDetectedAccess(
    CONTENT_PATH,
    JSON.stringify(items, null, 2),
    {
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json; charset=utf-8',
      cacheControlMaxAge: 0,
    }
  )

  return {
    items,
    access,
    blob,
  }
}

export async function ensureBlobToken() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN nao configurado no projeto.')
  }
}

export { json }
