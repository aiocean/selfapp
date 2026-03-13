import { ref } from 'vue'
import type { Note, CreateNote, UpdateNote } from '@shared/types'
import { rpc } from './useRpc'

const notes = ref<Note[]>([])
const loading = ref(false)

export function useNotes() {
  async function fetchNotes(query?: string) {
    loading.value = true
    try {
      notes.value = await rpc('notes.list', { query })
    } finally {
      loading.value = false
    }
  }

  async function createNote(input: CreateNote) {
    const note = await rpc('notes.create', input)
    notes.value.unshift(note)
    return note
  }

  async function updateNote(input: UpdateNote) {
    const updated = await rpc('notes.update', input)
    const idx = notes.value.findIndex((n) => n.id === input.id)
    if (idx !== -1) notes.value[idx] = updated
    return updated
  }

  async function deleteNote(id: string) {
    await rpc('notes.delete', { id })
    notes.value = notes.value.filter((n) => n.id !== id)
  }

  return { notes, loading, fetchNotes, createNote, updateNote, deleteNote }
}
