import { createSessionResponse } from './_lib/auth.js'

export async function POST(request) {
  try {
    const body = await request.json()
    const password = `${body?.password || ''}`
    const configuredPassword = `${process.env.ADMIN_PASSWORD || ''}`

    if (!configuredPassword) {
      return new Response(JSON.stringify({ error: 'ADMIN_PASSWORD nao configurada no projeto.' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      })
    }

    if (!password || password !== configuredPassword) {
      return new Response(JSON.stringify({ error: 'Senha incorreta.' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      })
    }

    return createSessionResponse({ ok: true })
  } catch (error) {
    return new Response(JSON.stringify({ error: error?.message || 'Erro ao autenticar.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    })
  }
}
