<script setup lang="ts">
import type { Note } from '@shared/types'

defineProps<{
  notes: Note[]
  selectedId?: string
  loading: boolean
}>()

defineEmits<{
  select: [note: Note]
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
</script>

<template>
  <div class="flex-1 overflow-y-auto">
    <div v-if="loading" class="p-4 text-sm text-muted-foreground">Loading...</div>
    <div v-else-if="notes.length === 0" class="p-4 text-sm text-muted-foreground">No notes</div>
    <div
      v-for="note in notes"
      :key="note.id"
      @click="$emit('select', note)"
      class="group px-3 py-2 border-b cursor-pointer hover:bg-accent"
      :class="{ 'bg-accent': selectedId === note.id }"
    >
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium truncate">
          {{ note.title || 'Untitled' }}
        </span>
        <button
          @click.stop="$emit('delete', note.id)"
          class="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive"
        >
          &times;
        </button>
      </div>
      <div class="text-xs text-muted-foreground mt-0.5">
        {{ formatDate(note.updated_at) }}
      </div>
    </div>
  </div>
</template>
