import { db } from './index'
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

db.run(`
  CREATE TABLE IF NOT EXISTS _migrations (
    name TEXT PRIMARY KEY,
    applied_at TEXT DEFAULT (datetime('now'))
  )
`)

const applied = new Set(
  db.query('SELECT name FROM _migrations').all().map((r: any) => r.name)
)

const migrationsDir = join(import.meta.dir, 'migrations')
const files = readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort()

for (const file of files) {
  if (applied.has(file)) continue
  const sql = readFileSync(join(migrationsDir, file), 'utf-8')
  db.run(sql)
  db.run('INSERT INTO _migrations (name) VALUES (?)', [file])
  console.log(`Applied: ${file}`)
}

console.log('Migrations complete.')
