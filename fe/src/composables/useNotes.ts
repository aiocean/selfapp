import { ref } from 'vue'
import type { Note, CreateNote, UpdateNote } from '@shared/types'
import { api } from './useApi'

const notes = ref<Note[]>([])
const loading = ref(false)

export function useNotes() {
  async function fetchNotes(query?: string) {
    loading.value = true
    try {
      notes.value = await api.notesList(query)
    } finally {
      loading.value = false
    }
  }

  async function createNote(input: CreateNote) {
    const note = await api.notesCreate(input)
    notes.value.unshift(note)
    return note
  }

  async function updateNote(id: string, input: UpdateNote) {
    const updated = await api.notesUpdate(id, input)
    const idx = notes.value.findIndex((n) => n.id === id)
    if (idx !== -1) notes.value[idx] = updated
    return updated
  }

  async function deleteNote(id: string) {
    await api.notesDelete(id)
    notes.value = notes.value.filter((n) => n.id !== id)
  }

  return { notes, loading, fetchNotes, createNote, updateNote, deleteNote }
}
