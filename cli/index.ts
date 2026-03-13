import { db } from '../db'
import type { Note } from '../shared/types'

const [command, ...args] = process.argv.slice(2)

const commands: Record<string, () => void> = {
  'notes:list'() {
    const notes = db.query('SELECT id, title, updated_at FROM notes ORDER BY updated_at DESC').all() as Note[]
    for (const n of notes) {
      console.log(`${n.id.slice(0, 8)}  ${n.title || '(untitled)'}  ${n.updated_at}`)
    }
  },

  'notes:create'() {
    const title = args[0] || 'Untitled'
    const content = args[1] || ''
    const id = crypto.randomUUID()
    db.run('INSERT INTO notes (id, title, content) VALUES (?, ?, ?)', [id, title, content])
    console.log(`Created: ${id}`)
  },

  'notes:delete'() {
    const id = args[0]
    if (!id) { console.error('Usage: bun run cli notes:delete <id>'); process.exit(1) }
    db.run('DELETE FROM notes WHERE id LIKE ?', [`${id}%`])
    console.log(`Deleted: ${id}`)
  },

  'db:migrate'() {
    require('../db/migrate')
  },

  help() {
    console.log(`
selfapp CLI

Commands:
  notes:list              List all notes
  notes:create <title>    Create a note
  notes:delete <id>       Delete a note (prefix match)
  db:migrate              Run database migrations
  help                    Show this help
    `.trim())
  },
}

const fn = commands[command || 'help']
if (!fn) {
  console.error(`Unknown command: ${command}. Run "bun run cli help" for usage.`)
  process.exit(1)
}
fn()
