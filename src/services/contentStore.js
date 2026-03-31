import { defaultContent } from '@/data/defaultContent'

function sortItems(items) {
  return [...items].sort((a, b) => (a.order || 0) - (b.order || 0))
}

async function parseError(response) {
  const text = await response.text()
  try {
    const json = JSON.parse(text)
    if (json?.error) return json.error
    if (json?.message) return json.message
  } catch {}
  return text || `Erro ${response.status}`
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    cache: 'no-store',
    ...options,
    headers: {
      ...(options.body && !(options.body instanceof Blob) && !(options.body instanceof FormData)
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  return response.json()
}

export async function getAdminContent() {
  const data = await requestJson('/api/content')
  if (!Array.isArray(data?.items)) {
    throw new Error('Resposta invalida do armazenamento online.')
  }
  return sortItems(data.items)
}

export async function getPublicContent() {
  try {
    return await getAdminContent()
  } catch {
    return sortItems(defaultContent)
  }
}

export async function saveAllContent(items) {
  const sorted = sortItems(items)
  const data = await requestJson('/api/content', {
    method: 'PUT',
    body: JSON.stringify({ items: sorted }),
  })

  if (!Array.isArray(data?.items)) {
    throw new Error('Nao foi possivel confirmar o salvamento online.')
  }

  return sortItems(data.items)
}

export async function createContent(item) {
  const items = await getAdminContent()
  const created = { id: crypto.randomUUID(), ...item }
  return saveAllContent([...items, created])
}

export async function updateContent(id, updates) {
  const items = await getAdminContent()
  return saveAllContent(items.map((item) => (item.id === id ? { ...item, ...updates } : item)))
}

export async function deleteContent(id) {
  const items = await getAdminContent()
  return saveAllContent(items.filter((item) => item.id !== id))
}

export async function resetContent() {
  const data = await requestJson('/api/reset', { method: 'POST' })
  if (!Array.isArray(data?.items)) {
    throw new Error('Nao foi possivel restaurar o conteudo online.')
  }
  return sortItems(data.items)
}

export async function uploadImage(file) {
  const fileName = encodeURIComponent(file.name || `imagem-${Date.now()}.jpg`)
  const response = await fetch(`/api/upload?filename=${fileName}`, {
    method: 'POST',
    body: file,
    headers: {
      'content-type': file.type || 'application/octet-stream',
    },
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  const data = await response.json()
  if (!data?.url) {
    throw new Error('Upload concluido sem URL de retorno.')
  }
  return data.url
}

export async function checkStorageConnection() {
  const data = await requestJson('/api/content')
  return {
    ok: Array.isArray(data?.items),
    mode: data?.mode || 'blob',
  }
}
