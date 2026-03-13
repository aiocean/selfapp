import { db } from '../../db'
import { rpc } from '../router'
import type { Note } from '../../shared/types'

rpc('notes.list', ({ query }) => {
  if (query) {
    return db
      .query('SELECT * FROM notes WHERE title LIKE ?1 OR content LIKE ?1 ORDER BY updated_at DESC')
      .all(`%${query}%`) as Note[]
  }
  return db.query('SELECT * FROM notes ORDER BY updated_at DESC').all() as Note[]
})

rpc('notes.get', ({ id }) => {
  const note = db.query('SELECT * FROM notes WHERE id = ?').get(id) as Note | null
  if (!note) throw new Error('Note not found')
  return note
})

rpc('notes.create', ({ title, content }) => {
  const id = crypto.randomUUID()
  db.run('INSERT INTO notes (id, title, content) VALUES (?, ?, ?)', [id, title, content])
  return db.query('SELECT * FROM notes WHERE id = ?').get(id) as Note
})

rpc('notes.update', ({ id, title, content }) => {
  const sets: string[] = []
  const params: any[] = []
  if (title !== undefined) { sets.push('title = ?'); params.push(title) }
  if (content !== undefined) { sets.push('content = ?'); params.push(content) }
  sets.push("updated_at = datetime('now')")
  params.push(id)
  db.run(`UPDATE notes SET ${sets.join(', ')} WHERE id = ?`, params)
  return db.query('SELECT * FROM notes WHERE id = ?').get(id) as Note
})

rpc('notes.delete', ({ id }) => {
  db.run('DELETE FROM notes WHERE id = ?', [id])
})
