import { defaultContent } from '@/data/defaultContent'

const STORAGE_KEY = 'camila-almeida-site-content-fallback-v1'

function sortItems(items) {
  return [...items].sort((a, b) => (a.order || 0) - (b.order || 0))
}

function readLocalFallback() {
  if (typeof window === 'undefined') return sortItems(defaultContent)
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultContent))
    return sortItems(defaultContent)
  }

  try {
    return sortItems(JSON.parse(raw))
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultContent))
    return sortItems(defaultContent)
  }
}

function writeLocalFallback(items) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sortItems(items)))
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `Erro ${response.status}`)
  }

  return response.json()
}

export async function getAllContent() {
  try {
    const data = await requestJson('/api/content', { cache: 'no-store' })
    if (Array.isArray(data?.items)) {
      writeLocalFallback(data.items)
      return sortItems(data.items)
    }
    return readLocalFallback()
  } catch {
    return readLocalFallback()
  }
}

export async function saveAllContent(items) {
  const sorted = sortItems(items)
  const data = await requestJson('/api/content', {
    method: 'PUT',
    body: JSON.stringify({ items: sorted }),
  })
  writeLocalFallback(data.items || sorted)
  return sortItems(data.items || sorted)
}

export async function createContent(item) {
  const items = await getAllContent()
  const created = { id: crypto.randomUUID(), ...item }
  return saveAllContent([...items, created])
}

export async function updateContent(id, updates) {
  const items = await getAllContent()
  return saveAllContent(items.map((item) => (item.id === id ? { ...item, ...updates } : item)))
}

export async function deleteContent(id) {
  const items = await getAllContent()
  return saveAllContent(items.filter((item) => item.id !== id))
}

export async function resetContent() {
  const data = await requestJson('/api/reset', { method: 'POST' })
  writeLocalFallback(data.items || defaultContent)
  return sortItems(data.items || defaultContent)
}

async function fileToBase64(file) {
  const buffer = await file.arrayBuffer()
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const chunkSize = 0x8000
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
  }
  return btoa(binary)
}

export async function uploadImage(file) {
  const base64 = await fileToBase64(file)
  const data = await requestJson('/api/upload', {
    method: 'POST',
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type,
      base64,
    }),
  })

  return data.url
}
