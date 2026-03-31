const COOKIE_NAME = 'admin_session'
const SESSION_VALUE = 'ok'
const MAX_AGE = 60 * 60 * 24 * 7

function buildCookie(value, maxAge) {
  const parts = [
    `${COOKIE_NAME}=${value}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Secure',
    `Max-Age=${maxAge}`,
  ]
  return parts.join('; ')
}

export function isAuthenticated(request) {
  const cookie = request.headers.get('cookie') || ''
  return cookie.split(';').some((part) => part.trim() === `${COOKIE_NAME}=${SESSION_VALUE}`)
}

export function requireAuth(request) {
  if (!isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: 'Nao autorizado.' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    })
  }
  return null
}

export function createSessionResponse(data = { ok: true }) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'Set-Cookie': buildCookie(SESSION_VALUE, MAX_AGE),
    },
  })
}

export function clearSessionResponse(data = { ok: true }) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'Set-Cookie': buildCookie('', 0),
    },
  })
}
