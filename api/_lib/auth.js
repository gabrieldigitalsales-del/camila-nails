const ONE_DAY = 60 * 60 * 24

function parseCookies(cookieHeader = '') {
  return Object.fromEntries(
    cookieHeader
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf('=')
        if (index === -1) return [part, '']
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))]
      })
  )
}

function isSecureRequest(request) {
  const proto = request.headers.get('x-forwarded-proto')
  return proto === 'https'
}

function buildSessionCookie(value, request, maxAge = ONE_DAY) {
  const parts = [
    `admin_session=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAge}`,
  ]

  if (isSecureRequest(request)) {
    parts.push('Secure')
  }

  return parts.join('; ')
}

export function requireAdminPassword() {
  const password = process.env.ADMIN_PASSWORD
  if (!password) {
    throw new Error('ADMIN_PASSWORD nao configurada no projeto.')
  }
  return password
}

export function isAuthenticated(request) {
  const cookies = parseCookies(request.headers.get('cookie') || '')
  const expected = process.env.ADMIN_PASSWORD || ''
  return Boolean(expected) && cookies.admin_session === expected
}

export function unauthorized() {
  return new Response(JSON.stringify({ error: 'Nao autorizado.' }), {
    status: 401,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}

export function createSessionHeaders(request) {
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Set-Cookie': buildSessionCookie(requireAdminPassword(), request),
  }
}

export function clearSessionHeaders(request) {
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Set-Cookie': buildSessionCookie('', request, 0),
  }
}
