import { rpc } from '../router'
import type { Note } from '../../shared/types'

rpc('notes.list', async ({ query }, db) => {
  if (query) {
    const { results } = await db
      .prepare('SELECT * FROM notes WHERE title LIKE ?1 OR content LIKE ?1 ORDER BY updated_at DESC')
      .bind(`%${query}%`)
      .all<Note>()
    return results
  }
  const { results } = await db
    .prepare('SELECT * FROM notes ORDER BY updated_at DESC')
    .all<Note>()
  return results
})

rpc('notes.get', async ({ id }, db) => {
  const note = await db
    .prepare('SELECT * FROM notes WHERE id = ?')
    .bind(id)
    .first<Note>()
  if (!note) throw new Error('Note not found')
  return note
})

rpc('notes.create', async ({ title, content }, db) => {
  const id = crypto.randomUUID()
  await db
    .prepare('INSERT INTO notes (id, title, content) VALUES (?, ?, ?)')
    .bind(id, title, content)
    .run()
  const note = await db
    .prepare('SELECT * FROM notes WHERE id = ?')
    .bind(id)
    .first<Note>()
  return note!
})

rpc('notes.update', async ({ id, title, content }, db) => {
  const sets: string[] = []
  const params: any[] = []
  if (title !== undefined) { sets.push('title = ?'); params.push(title) }
  if (content !== undefined) { sets.push('content = ?'); params.push(content) }
  sets.push("updated_at = datetime('now')")
  params.push(id)
  await db
    .prepare(`UPDATE notes SET ${sets.join(', ')} WHERE id = ?`)
    .bind(...params)
    .run()
  const note = await db
    .prepare('SELECT * FROM notes WHERE id = ?')
    .bind(id)
    .first<Note>()
  return note!
})

rpc('notes.delete', async ({ id }, db) => {
  await db
    .prepare('DELETE FROM notes WHERE id = ?')
    .bind(id)
    .run()
})
