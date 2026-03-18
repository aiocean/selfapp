import { Hono } from 'hono'
import type { Note } from '../../shared/types'

type Bindings = Env

const app = new Hono<{ Bindings: Bindings }>()

// GET /api/notes — list all notes, optional ?q= search
app.get('/', async (c) => {
  const query = c.req.query('q')
  const db = c.env.DB

  if (query) {
    const { results } = await db
      .prepare(
        'SELECT * FROM notes WHERE title LIKE ?1 OR content LIKE ?1 ORDER BY updated_at DESC',
      )
      .bind(`%${query}%`)
      .all<Note>()
    return c.json(results)
  }

  const { results } = await db.prepare('SELECT * FROM notes ORDER BY updated_at DESC').all<Note>()
  return c.json(results)
})

// GET /api/notes/:id — get single note
app.get('/:id', async (c) => {
  const id = c.req.param('id')
  const note = await c.env.DB.prepare('SELECT * FROM notes WHERE id = ?').bind(id).first<Note>()

  if (!note) return c.json({ error: 'Note not found' }, 404)
  return c.json(note)
})

// POST /api/notes — create note
app.post('/', async (c) => {
  const { title, content } = await c.req.json<{ title: string; content: string }>()
  const id = crypto.randomUUID()
  const db = c.env.DB

  await db
    .prepare('INSERT INTO notes (id, title, content) VALUES (?, ?, ?)')
    .bind(id, title, content)
    .run()

  const note = await db.prepare('SELECT * FROM notes WHERE id = ?').bind(id).first<Note>()

  return c.json(note!, 201)
})

// PUT /api/notes/:id — update note
app.put('/:id', async (c) => {
  const id = c.req.param('id')
  const { title, content } = await c.req.json<{ title?: string; content?: string }>()
  const db = c.env.DB

  const sets: string[] = []
  const params: (string | number)[] = []
  if (title !== undefined) {
    sets.push('title = ?')
    params.push(title)
  }
  if (content !== undefined) {
    sets.push('content = ?')
    params.push(content)
  }
  sets.push("updated_at = datetime('now')")
  params.push(id)

  await db
    .prepare(`UPDATE notes SET ${sets.join(', ')} WHERE id = ?`)
    .bind(...params)
    .run()

  const note = await db.prepare('SELECT * FROM notes WHERE id = ?').bind(id).first<Note>()

  if (!note) return c.json({ error: 'Note not found' }, 404)
  return c.json(note)
})

// DELETE /api/notes/:id — delete note
app.delete('/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare('DELETE FROM notes WHERE id = ?').bind(id).run()

  return c.body(null, 204)
})

export { app as notesRoutes }
