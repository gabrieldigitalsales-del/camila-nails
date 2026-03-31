import { clearSessionResponse } from './_lib/auth.js'

export async function POST() {
  return clearSessionResponse({ ok: true })
}
