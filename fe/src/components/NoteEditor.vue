<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Note } from '@shared/types'

const props = defineProps<{ note: Note }>()
const emit = defineEmits<{ save: [data: { title: string; content: string }] }>()

const title = ref(props.note.title)
const content = ref(props.note.content)
let saveTimer: ReturnType<typeof setTimeout> | null = null

watch(() => props.note.id, () => {
  title.value = props.note.title
  content.value = props.note.content
})

function scheduleAutoSave() {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    emit('save', { title: title.value, content: content.value })
  }, 500)
}
</script>

<template>
  <div class="flex flex-col h-full">
    <input
      v-model="title"
      @input="scheduleAutoSave"
      placeholder="Title"
      class="px-6 py-4 text-xl font-semibold bg-transparent border-b outline-none"
    />
    <textarea
      v-model="content"
      @input="scheduleAutoSave"
      placeholder="Start writing..."
      class="flex-1 px-6 py-4 bg-transparent outline-none resize-none text-sm leading-relaxed"
    />
  </div>
</template>
