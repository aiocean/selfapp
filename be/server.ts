import { handleRpc } from './router'
import './handlers/notes'
import { existsSync } from 'fs'
import { join } from 'path'

const PORT = Number(process.env.PORT) || 3000
const STATIC_DIR = join(import.meta.dir, '..', 'fe', 'dist')

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url)

    // RPC endpoint
    if (url.pathname === '/api/rpc' && req.method === 'POST') {
      try {
        const { method, input } = await req.json()
        const result = await handleRpc(method, input)
        return Response.json({ result })
      } catch (e: any) {
        return Response.json({ error: e.message }, { status: 400 })
      }
    }

    // Serve static files (production)
    if (existsSync(STATIC_DIR)) {
      const filePath = join(STATIC_DIR, url.pathname === '/' ? 'index.html' : url.pathname)
      const file = Bun.file(filePath)
      if (await file.exists()) return new Response(file)
      // SPA fallback
      return new Response(Bun.file(join(STATIC_DIR, 'index.html')))
    }

    return Response.json({ error: 'Not found' }, { status: 404 })
  },
})

console.log(`Server running at http://localhost:${PORT}`)
