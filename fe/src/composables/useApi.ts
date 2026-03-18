import type { Note, CreateNote, UpdateNote } from '@shared/types'

const BASE = '/api/notes'

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
  notesList: (query?: string) =>
    request<Note[]>(query ? `${BASE}?q=${encodeURIComponent(query)}` : BASE),

  notesGet: (id: string) => request<Note>(`${BASE}/${id}`),

  notesCreate: (input: CreateNote) =>
    request<Note>(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }),

  notesUpdate: (id: string, input: Omit<UpdateNote, 'id'>) =>
    request<Note>(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }),

  notesDelete: (id: string) => request<void>(`${BASE}/${id}`, { method: 'DELETE' }),
}
