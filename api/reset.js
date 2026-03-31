import { put } from '@vercel/blob'
import { defaultContent } from '../src/data/defaultContent.js'

const CONTENT_PATH = 'site-content/content.json'

export async function POST() {
  await put(CONTENT_PATH, JSON.stringify(defaultContent, null, 2), {
    access: 'public',
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: 'application/json; charset=utf-8',
    cacheControlMaxAge: 0,
  })

  return Response.json({ items: defaultContent })
}
