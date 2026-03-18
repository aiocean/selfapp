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
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <div class="relative w-80 border-r border-border/60 flex flex-col bg-sidebar paper-texture">
      <!-- Header -->
      <div class="px-5 pt-6 pb-4 flex items-center justify-between">
        <h1 class="font-serif text-2xl italic tracking-tight text-foreground/90">Notes</h1>
        <button
          @click="onNew"
          class="p-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-200 hover:shadow-md active:scale-95 font-medium"
          title="New note"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path d="M12 5v14m-7-7h14" />
          </svg>
        </button>
      </div>

      <!-- Search -->
      <div class="px-4 pb-3">
        <div class="relative">
          <svg
            class="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            v-model="searchQuery"
            @input="onSearch"
            placeholder="Search notes..."
            class="w-full pl-5 pr-3 py-2 text-sm border border-border/50 rounded-lg bg-background/60 backdrop-blur-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring/40 transition-all duration-200"
          />
        </div>
      </div>

      <!-- Separator line -->
      <div class="mx-5 border-t border-border/40" />

      <!-- Note list -->
      <NoteList
        :notes="notes"
        :selected-id="selectedNote?.id"
        :loading="loading"
        @select="selectedNote = $event"
        @delete="onDelete"
      />
    </div>

    <!-- Editor / Empty State -->
    <div class="flex-1 relative paper-texture">
      <NoteEditor v-if="selectedNote" :note="selectedNote" @save="onSave" />

      <!-- Empty state -->
      <div v-else class="flex flex-col items-center justify-center h-full animate-fade-in-up">
        <div class="relative mb-8">
          <!-- Decorative elements -->
          <div class="absolute -inset-8 bg-accent/5 rounded-full blur-2xl" />
          <svg class="relative w-20 h-20 text-accent/30" viewBox="0 0 80 80" fill="none">
            <!-- Book/journal icon -->
            <rect
              x="14"
              y="10"
              width="52"
              height="60"
              rx="4"
              stroke="currentColor"
              stroke-width="1.5"
            />
            <path
              d="M14 10h4a4 4 0 0 1 4 4v52a4 4 0 0 1-4 4h-4"
              stroke="currentColor"
              stroke-width="1.5"
            />
            <line
              x1="30"
              y1="26"
              x2="56"
              y2="26"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <line
              x1="30"
              y1="36"
              x2="50"
              y2="36"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              opacity="0.6"
            />
            <line
              x1="30"
              y1="46"
              x2="52"
              y2="46"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              opacity="0.4"
            />
          </svg>
        </div>
        <p class="font-serif text-xl italic text-foreground/40 mb-2">
          Start writing something beautiful
        </p>
        <p class="text-sm text-muted-foreground/50 mb-6">Select a note or create a new one</p>
        <button
          @click="onNew"
          class="group flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-primary border border-primary/20 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 active:scale-95"
        >
          <svg
            class="w-4 h-4 transition-transform duration-300 group-hover:rotate-90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 5v14m-7-7h14" />
          </svg>
          New note
        </button>
      </div>
    </div>
  </div>
</template>
