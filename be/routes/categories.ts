import { Hono } from 'hono'
import type { Category } from '../../shared/types'

type Bindings = Env

const app = new Hono<{ Bindings: Bindings }>()

// GET /api/categories — list all categories
app.get('/', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM categories ORDER BY name ASC').all<Category>()
  return c.json(results)
})

// POST /api/categories — create category
app.post('/', async (c) => {
  const { name, color } = await c.req.json<{ name: string; color?: string }>()

  if (!name || name.trim().length === 0) {
    return c.json({ error: 'Name is required' }, 400)
  }

  const id = crypto.randomUUID()
  const db = c.env.DB

  await db
    .prepare('INSERT INTO categories (id, name, color) VALUES (?, ?, ?)')
    .bind(id, name.trim(), color ?? '#6b7280')
    .run()

  const category = await db.prepare('SELECT * FROM categories WHERE id = ?').bind(id).first<Category>()

  return c.json(category!, 201)
})

// PUT /api/categories/:id — update category
app.put('/:id', async (c) => {
  const id = c.req.param('id')
  const { name, color } = await c.req.json<{ name?: string; color?: string }>()
  const db = c.env.DB

  const sets: string[] = []
  const params: string[] = []

  if (name !== undefined) {
    sets.push('name = ?')
    params.push(name.trim())
  }
  if (color !== undefined) {
    sets.push('color = ?')
    params.push(color)
  }

  if (sets.length === 0) {
    return c.json({ error: 'Nothing to update' }, 400)
  }

  params.push(id)

  await db
    .prepare(`UPDATE categories SET ${sets.join(', ')} WHERE id = ?`)
    .bind(...params)
    .run()

  const category = await db.prepare('SELECT * FROM categories WHERE id = ?').bind(id).first<Category>()

  if (!category) return c.json({ error: 'Category not found' }, 404)
  return c.json(category)
})

// DELETE /api/categories/:id — delete category (notes keep but lose category_id)
app.delete('/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(id).run()
  return c.body(null, 204)
})

export { app as categoriesRoutes }
