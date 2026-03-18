import { Hono } from 'hono'
import { notesRoutes } from './routes/notes'

type Bindings = Env

const app = new Hono<{ Bindings: Bindings }>()

// REST API routes
app.route('/api/notes', notesRoutes)

// Static assets (SPA) handled by assets binding
app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default {
  fetch: app.fetch,

  async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext): Promise<void> {
    // Cleanup empty notes older than 7 days
    const result = await env.DB.prepare(
      "DELETE FROM notes WHERE title = '' AND content = '' AND created_at < datetime('now', '-7 days')",
    ).run()

    void result.meta.changes
  },
}
