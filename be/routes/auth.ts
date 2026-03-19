import { Hono } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { hashPassword, verifyPassword, generateSessionId } from '../auth'
import type { User } from '../../shared/types'

type Bindings = Env

const app = new Hono<{ Bindings: Bindings }>()

const SESSION_MAX_AGE = 30 * 24 * 60 * 60 // 30 days in seconds

// GET /api/auth/status — check if setup needed + current user
app.get('/status', async (c) => {
  const db = c.env.DB
  const userCount = await db.prepare('SELECT COUNT(*) as count FROM users').first<{ count: number }>()
  const needsSetup = !userCount || userCount.count === 0

  // Check session
  const sessionId = getCookie(c, 'session')
  if (!sessionId) return c.json({ needsSetup, user: null })

  const row = await db
    .prepare(
      `SELECT u.id, u.username, u.created_at FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.id = ? AND s.expires_at > datetime('now')`,
    )
    .bind(sessionId)
    .first<User>()

  return c.json({ needsSetup, user: row ?? null })
})

// POST /api/auth/setup — create first user (one-time only)
app.post('/setup', async (c) => {
  const db = c.env.DB
  const userCount = await db.prepare('SELECT COUNT(*) as count FROM users').first<{ count: number }>()

  if (userCount && userCount.count > 0) {
    return c.json({ error: 'Setup already completed' }, 400)
  }

  const { username, password } = await c.req.json<{ username: string; password: string }>()

  if (!username || username.length < 2) {
    return c.json({ error: 'Username must be at least 2 characters' }, 400)
  }
  if (!password || password.length < 6) {
    return c.json({ error: 'Password must be at least 6 characters' }, 400)
  }

  const userId = crypto.randomUUID()
  const passwordHash = await hashPassword(password)

  await db.prepare('INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)').bind(userId, username, passwordHash).run()

  // Auto-login after setup
  const sessionId = generateSessionId()
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000).toISOString()

  await db.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)').bind(sessionId, userId, expiresAt).run()

  setCookie(c, 'session', sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })

  const user = await db.prepare('SELECT id, username, created_at FROM users WHERE id = ?').bind(userId).first<User>()

  return c.json({ user }, 201)
})

// POST /api/auth/login
app.post('/login', async (c) => {
  const db = c.env.DB
  const { username, password } = await c.req.json<{ username: string; password: string }>()

  if (!username || !password) {
    return c.json({ error: 'Username and password are required' }, 400)
  }

  const row = await db
    .prepare('SELECT id, username, password_hash, created_at FROM users WHERE username = ?')
    .bind(username)
    .first<{ id: string; username: string; password_hash: string; created_at: string }>()

  if (!row || !(await verifyPassword(password, row.password_hash))) {
    return c.json({ error: 'Invalid username or password' }, 401)
  }

  // Create session
  const sessionId = generateSessionId()
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000).toISOString()

  // Clean up old sessions for this user
  await db.batch([
    db.prepare("DELETE FROM sessions WHERE user_id = ? OR expires_at < datetime('now')").bind(row.id),
    db.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)').bind(sessionId, row.id, expiresAt),
  ])

  setCookie(c, 'session', sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })

  return c.json({ user: { id: row.id, username: row.username, created_at: row.created_at } })
})

// POST /api/auth/logout
app.post('/logout', async (c) => {
  const sessionId = getCookie(c, 'session')
  if (sessionId) {
    await c.env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run()
  }
  deleteCookie(c, 'session', { path: '/' })
  return c.body(null, 204)
})

export { app as authRoutes }
