import { Hono } from 'hono'
import type { NoteWithCategory } from '../../shared/types'

type Bindings = Env

const app = new Hono<{ Bindings: Bindings }>()

// Base SELECT with category join — used by list and get
const NOTE_SELECT = `
  SELECT n.*, c.name as category_name, c.color as category_color
  FROM notes n
  LEFT JOIN categories c ON c.id = n.category_id`

// GET /api/notes — list all notes, optional ?q= search, optional ?category= filter
app.get('/', async (c) => {
  const query = c.req.query('q')
  const categoryId = c.req.query('category')
  const db = c.env.DB

  if (query && categoryId) {
    const { results } = await db
      .prepare(
        `${NOTE_SELECT} WHERE (n.title LIKE ?1 OR n.content LIKE ?1) AND n.category_id = ?2 ORDER BY n.updated_at DESC`,
      )
      .bind(`%${query}%`, categoryId)
      .all<NoteWithCategory>()
    return c.json(results)
  }

  if (query) {
    const { results } = await db
      .prepare(
        `${NOTE_SELECT} WHERE n.title LIKE ?1 OR n.content LIKE ?1 ORDER BY n.updated_at DESC`,
      )
      .bind(`%${query}%`)
      .all<NoteWithCategory>()
    return c.json(results)
  }

  if (categoryId) {
    const { results } = await db
      .prepare(`${NOTE_SELECT} WHERE n.category_id = ? ORDER BY n.updated_at DESC`)
      .bind(categoryId)
      .all<NoteWithCategory>()
    return c.json(results)
  }

  const { results } = await db.prepare(`${NOTE_SELECT} ORDER BY n.updated_at DESC`).all<NoteWithCategory>()
  return c.json(results)
})

// GET /api/notes/:id — get single note with category
app.get('/:id', async (c) => {
  const id = c.req.param('id')
  const note = await c.env.DB
    .prepare(`${NOTE_SELECT} WHERE n.id = ?`)
    .bind(id)
    .first<NoteWithCategory>()

  if (!note) return c.json({ error: 'Note not found' }, 404)
  return c.json(note)
})

// POST /api/notes — create note
app.post('/', async (c) => {
  const { title, content, category_id } = await c.req.json<{
    title: string
    content: string
    category_id?: string | null
  }>()
  const id = crypto.randomUUID()
  const db = c.env.DB

  await db
    .prepare('INSERT INTO notes (id, title, content, category_id) VALUES (?, ?, ?, ?)')
    .bind(id, title, content, category_id ?? null)
    .run()

  const note = await db
    .prepare(`${NOTE_SELECT} WHERE n.id = ?`)
    .bind(id)
    .first<NoteWithCategory>()

  return c.json(note!, 201)
})

// PUT /api/notes/:id — update note
app.put('/:id', async (c) => {
  const id = c.req.param('id')
  const { title, content, category_id } = await c.req.json<{
    title?: string
    content?: string
    category_id?: string | null
  }>()
  const db = c.env.DB

  const sets: string[] = []
  const params: (string | number | null)[] = []
  if (title !== undefined) {
    sets.push('title = ?')
    params.push(title)
  }
  if (content !== undefined) {
    sets.push('content = ?')
    params.push(content)
  }
  if (category_id !== undefined) {
    sets.push('category_id = ?')
    params.push(category_id)
  }
  sets.push("updated_at = datetime('now')")
  params.push(id)

  await db
    .prepare(`UPDATE notes SET ${sets.join(', ')} WHERE id = ?`)
    .bind(...params)
    .run()

  const note = await db
    .prepare(`${NOTE_SELECT} WHERE n.id = ?`)
    .bind(id)
    .first<NoteWithCategory>()

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
