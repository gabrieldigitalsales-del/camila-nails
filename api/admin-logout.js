import { clearSessionHeaders } from './_lib/auth.js'

export async function POST(request) {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: clearSessionHeaders(request),
  })
}
