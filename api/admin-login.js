import { createSessionHeaders, requireAdminPassword } from './_lib/auth.js'

export async function POST(request) {
  try {
    const { password } = await request.json()
    const expected = requireAdminPassword()

    if (!password || password !== expected) {
      return new Response(JSON.stringify({ error: 'Senha incorreta.' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      })
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: createSessionHeaders(request),
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error?.message || 'Erro ao fazer login.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    })
  }
}
