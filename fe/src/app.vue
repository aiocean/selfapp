<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useNotes } from './composables/useNotes'
import NoteList from './components/NoteList.vue'
import NoteEditor from './components/NoteEditor.vue'
import type { Note } from '@shared/types'

const { notes, loading, fetchNotes, createNote, updateNote, deleteNote } = useNotes()
const selectedNote = ref<Note | null>(null)
const searchQuery = ref('')

onMounted(() => fetchNotes())

async function onNew() {
  const note = await createNote({ title: '', content: '' })
  selectedNote.value = note
}

async function onSave(data: { title: string; content: string }) {
  if (!selectedNote.value) return
  const updated = await updateNote(selectedNote.value.id, data)
  selectedNote.value = updated
}

async function onDelete(id: string) {
  await deleteNote(id)
  if (selectedNote.value?.id === id) selectedNote.value = null
}

async function onSearch() {
  await fetchNotes(searchQuery.value || undefined)
}
</script>

<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <div class="w-72 border-r flex flex-col">
      <div class="p-3 border-b flex gap-2">
        <input
          v-model="searchQuery"
          @input="onSearch"
          placeholder="Search..."
          class="flex-1 px-3 py-1.5 text-sm border rounded-md bg-background"
        />
        <button
          @click="onNew"
          class="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90"
        >
          +
        </button>
      </div>
      <NoteList
        :notes="notes"
        :selected-id="selectedNote?.id"
        :loading="loading"
        @select="selectedNote = $event"
        @delete="onDelete"
      />
    </div>

    <!-- Editor -->
    <div class="flex-1">
      <NoteEditor
        v-if="selectedNote"
        :note="selectedNote"
        @save="onSave"
      />
      <div v-else class="flex items-center justify-center h-full text-muted-foreground">
        Select a note or create a new one
      </div>
    </div>
  </div>
</template>
