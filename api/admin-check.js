import { adminPasswordConfigured, isAuthenticated } from './_lib/auth.js'

export async function GET(request) {
  return new Response(
    JSON.stringify({
      authenticated: isAuthenticated(request),
      configured: adminPasswordConfigured(),
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
    }
  )
}
