import { isAuthenticated } from './_lib/auth.js'

export async function GET(request) {
  const authenticated = isAuthenticated(request)
  return new Response(JSON.stringify({ authenticated }), {
    status: authenticated ? 200 : 401,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
