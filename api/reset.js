import { requireAdmin } from './_lib/auth.js'
import { defaultContent } from '../src/data/defaultContent.js'
import { ensureBlobToken, json, saveJsonContent } from './_lib/blobStore.js'

export async function POST(request) {
  const authError = requireAdmin(request)
  if (authError) return authError
  try {
    await ensureBlobToken()
    const saved = await saveJsonContent(defaultContent)
    return json({ items: saved.items, mode: 'blob', access: saved.access, pathname: saved.blob.pathname })
  } catch (error) {
    return json({ error: error?.message || 'Erro interno ao restaurar conteudo.' }, 500)
  }
}
