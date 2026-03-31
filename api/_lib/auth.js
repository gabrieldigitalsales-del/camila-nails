function getCookieMap(request) {
  const cookieHeader = request.headers.get('cookie') || ''
  const pairs = cookieHeader.split(';').map((part) => part.trim()).filter(Boolean)
  return Object.fromEntries(
    pairs.map((pair) => {
      const idx = pair.indexOf('=')
      if (idx === -1) return [pair, '']
      return [pair.slice(0, idx), decodeURIComponent(pair.slice(idx + 1))]
    })
  )
}

function getAdminSecret() {
  return (process.env.ADMIN_PASSWORD || '').trim()
}

export function isAuthenticated(request) {
  const secret = getAdminSecret()
  if (!secret) return false
  const cookies = getCookieMap(request)
  return cookies.admin_session === secret
}

export function requireAdmin(request) {
  if (!getAdminSecret()) {
    return new Response(JSON.stringify({ error: 'ADMIN_PASSWORD nao configurada na Vercel.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    })
  }

  if (!isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: 'Nao autorizado.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    })
  }

  return null
}

export function createSessionCookie() {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `admin_session=${encodeURIComponent(getAdminSecret())}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${secure}`
}

export function clearSessionCookie() {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`
}

export function adminPasswordConfigured() {
  return Boolean(getAdminSecret())
}
