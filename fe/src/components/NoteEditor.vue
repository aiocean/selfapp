<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Note } from '@shared/types'

const props = defineProps<{ note: Note }>()
const emit = defineEmits<{ save: [data: { title: string; content: string }] }>()

const title = ref(props.note.title)
const content = ref(props.note.content)
const saving = ref(false)
let saveTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.note.id,
  () => {
    title.value = props.note.title
    content.value = props.note.content
  },
)

const wordCount = computed(() => {
  const text = content.value.trim()
  if (!text) return 0
  return text.split(/\s+/).length
})

const createdDate = computed(() => {
  return new Date(props.note.created_at + 'Z').toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})

function scheduleAutoSave() {
  saving.value = true
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    emit('save', { title: title.value, content: content.value })
    saving.value = false
  }, 500)
}
</script>

<template>
  <div class="flex flex-col h-full animate-fade-in-up">
    <!-- Editor header area -->
    <div class="px-10 pt-8 pb-2">
      <input
        v-model="title"
        @input="scheduleAutoSave"
        placeholder="Untitled"
        class="w-full font-serif text-3xl italic tracking-tight bg-transparent outline-none placeholder:text-foreground/15 text-foreground/90 caret-primary"
      />
      <!-- Meta bar -->
      <div
        class="flex items-center gap-3 mt-3 text-[11px] text-muted-foreground/40 tracking-wider uppercase"
      >
        <span>{{ createdDate }}</span>
        <span class="w-0.5 h-0.5 rounded-full bg-muted-foreground/20" />
        <span>{{ wordCount }} {{ wordCount === 1 ? 'word' : 'words' }}</span>
        <span class="w-0.5 h-0.5 rounded-full bg-muted-foreground/20" />
        <span class="flex items-center gap-1">
          <span
            class="inline-block w-1.5 h-1.5 rounded-full transition-colors duration-300"
            :class="saving ? 'bg-accent animate-pulse' : 'bg-emerald-400/60'"
          />
          {{ saving ? 'Saving...' : 'Saved' }}
        </span>
      </div>
    </div>

    <!-- Divider -->
    <div class="mx-10 mt-3 border-t border-border/30" />

    <!-- Content area -->
    <textarea
      v-model="content"
      @input="scheduleAutoSave"
      placeholder="Start writing..."
      class="flex-1 px-10 py-6 bg-transparent outline-none resize-none text-[15px] leading-[1.85] text-foreground/80 placeholder:text-foreground/10 caret-primary selection:bg-accent/15 fancy-scroll"
    />
  </div>
</template>
