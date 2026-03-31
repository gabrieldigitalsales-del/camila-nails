import { isAuthenticated, requireAdminPassword } from './_lib/auth.js'

export async function GET(request) {
  try {
    requireAdminPassword()
    return new Response(JSON.stringify({ authenticated: isAuthenticated(request) }), {
      status: isAuthenticated(request) ? 200 : 401,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error?.message || 'Erro ao validar sessao.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    })
  }
}
