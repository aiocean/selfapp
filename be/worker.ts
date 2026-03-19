import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'
import { authRoutes } from './routes/auth'
import { categoriesRoutes } from './routes/categories'
import { notesRoutes } from './routes/notes'

type Bindings = Env

const app = new Hono<{ Bindings: Bindings }>()

// Public auth routes (no middleware)
app.route('/api/auth', authRoutes)

// Auth middleware for all other API routes
app.use('/api/*', async (c, next) => {
  const sessionId = getCookie(c, 'session')
  if (!sessionId) return c.json({ error: 'Unauthorized' }, 401)

  const session = await c.env.DB.prepare(
    "SELECT user_id FROM sessions WHERE id = ? AND expires_at > datetime('now')",
  )
    .bind(sessionId)
    .first<{ user_id: string }>()

  if (!session) return c.json({ error: 'Unauthorized' }, 401)

  return next()
})

// Protected API routes
app.route('/api/categories', categoriesRoutes)
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

    // Cleanup expired sessions
    await env.DB.prepare("DELETE FROM sessions WHERE expires_at < datetime('now')").run()
  },
}
