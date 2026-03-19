import type { NoteWithCategory, CreateNote, UpdateNote, Category, CreateCategory, UpdateCategory, AuthStatus, User } from '@shared/types'

const BASE = '/api/notes'
const CATEGORIES = '/api/categories'
const AUTH = '/api/auth'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(((body as Record<string, unknown>).error as string) || `HTTP ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export const api = {
  // Auth
  authStatus: () => request<AuthStatus>(`${AUTH}/status`),

  authSetup: (input: { username: string; password: string }) =>
    request<{ user: User }>(`${AUTH}/setup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }),

  authLogin: (input: { username: string; password: string }) =>
    request<{ user: User }>(`${AUTH}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }),

  authLogout: () => request<void>(`${AUTH}/logout`, { method: 'POST' }),

  // Categories
  categoriesList: () => request<Category[]>(CATEGORIES),

  categoriesCreate: (input: CreateCategory) =>
    request<Category>(CATEGORIES, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }),

  categoriesUpdate: (id: string, input: UpdateCategory) =>
    request<Category>(`${CATEGORIES}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }),

  categoriesDelete: (id: string) => request<void>(`${CATEGORIES}/${id}`, { method: 'DELETE' }),

  // Notes (with category join)
  notesList: (query?: string, categoryId?: string) => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (categoryId) params.set('category', categoryId)
    const qs = params.toString()
    return request<NoteWithCategory[]>(qs ? `${BASE}?${qs}` : BASE)
  },

  notesGet: (id: string) => request<NoteWithCategory>(`${BASE}/${id}`),

  notesCreate: (input: CreateNote) =>
    request<NoteWithCategory>(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }),

  notesUpdate: (id: string, input: UpdateNote) =>
    request<NoteWithCategory>(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }),

  notesDelete: (id: string) => request<void>(`${BASE}/${id}`, { method: 'DELETE' }),
}
