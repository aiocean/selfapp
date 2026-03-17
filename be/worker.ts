import { handleRpc } from './router'
import './handlers/notes'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    // RPC endpoint
    if (url.pathname === '/api/rpc' && request.method === 'POST') {
      try {
        const body = (await request.json()) as { method: string; input: unknown }
        const result = await handleRpc(env, body.method, body.input)
        return Response.json({ result })
      } catch (e: any) {
        return Response.json({ error: e.message }, { status: 400 })
      }
    }

    // Static assets (SPA) handled by assets binding
    return env.ASSETS.fetch(request)
  },

  async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext): Promise<void> {
    // Cleanup empty notes older than 7 days
    const result = await env.DB.prepare(
      "DELETE FROM notes WHERE title = '' AND content = '' AND created_at < datetime('now', '-7 days')"
    ).run()

    if (result.meta.changes > 0) {
      console.log(`Cleaned up ${result.meta.changes} empty notes`)
    }
  },
}
