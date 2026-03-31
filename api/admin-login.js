import { adminPasswordConfigured, createSessionCookie } from './_lib/auth.js'

export async function POST(request) {
  try {
    if (!adminPasswordConfigured()) {
      return new Response(JSON.stringify({ error: 'ADMIN_PASSWORD nao configurada na Vercel.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      })
    }

    const body = await request.json()
    const password = `${body?.password || ''}`

    if (password !== `${process.env.ADMIN_PASSWORD || ''}`) {
      return new Response(JSON.stringify({ error: 'Senha incorreta.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      })
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Set-Cookie': createSessionCookie(),
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error?.message || 'Erro ao fazer login.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    })
  }
}
