<script setup lang="ts">
import type { NoteWithCategory } from '@shared/types'

defineProps<{
  notes: NoteWithCategory[]
  selectedId?: string
  loading: boolean
}>()

defineEmits<{
  select: [note: NoteWithCategory]
  delete: [id: string]
}>()

function formatDate(date: string) {
  return new Date(date + 'Z').toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getPreview(content: string) {
  if (!content) return 'Empty note'
  return content.slice(0, 80).replace(/\n/g, ' ')
}
</script>

<template>
  <div class="flex-1 overflow-y-auto fancy-scroll px-3 py-2">
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="flex gap-1">
        <div
          class="w-1.5 h-1.5 rounded-full bg-accent/40 animate-bounce"
          style="animation-delay: 0ms"
        />
        <div
          class="w-1.5 h-1.5 rounded-full bg-accent/40 animate-bounce"
          style="animation-delay: 150ms"
        />
        <div
          class="w-1.5 h-1.5 rounded-full bg-accent/40 animate-bounce"
          style="animation-delay: 300ms"
        />
      </div>
    </div>

    <!-- Empty -->
    <div
      v-else-if="notes.length === 0"
      class="flex flex-col items-center justify-center py-16 text-center"
    >
      <svg
        class="w-10 h-10 text-muted-foreground/20 mb-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path
          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
        />
      </svg>
      <p class="text-sm text-muted-foreground/50 italic font-serif">No notes yet</p>
    </div>

    <!-- Notes -->
    <div v-else class="space-y-1">
      <div
        v-for="note in notes"
        :key="note.id"
        @click="$emit('select', note)"
        class="group relative px-4 py-3 rounded-lg cursor-pointer transition-all duration-200"
        :class="[selectedId === note.id ? 'bg-accent/15 shadow-sm' : 'hover:bg-accent/8']"
      >
        <!-- Selection indicator -->
        <div
          v-if="selectedId === note.id"
          class="absolute left-1 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-full"
        />

        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0 flex-1">
            <h3
              class="text-sm font-medium truncate transition-colors duration-200"
              :class="
                selectedId === note.id
                  ? 'text-foreground'
                  : 'text-foreground/80 group-hover:text-foreground'
              "
            >
              {{ note.title || 'Untitled' }}
            </h3>
            <p class="text-xs text-muted-foreground/60 mt-1 truncate leading-relaxed">
              {{ getPreview(note.content) }}
            </p>
            <time
              class="text-[10px] text-muted-foreground/40 mt-1.5 block tracking-wider uppercase"
            >
              {{ formatDate(note.updated_at) }}
            </time>
          </div>

          <button
            @click.stop="$emit('delete', note.id)"
            class="mt-0.5 p-1 rounded-md text-muted-foreground/30 opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
            title="Delete"
          >
            <svg
              class="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
