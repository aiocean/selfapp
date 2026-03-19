<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  needsSetup: boolean
  error: string
}>()

const emit = defineEmits<{
  setup: [username: string, password: string]
  login: [username: string, password: string]
}>()

const username = ref('')
const password = ref('')
const submitting = ref(false)

async function onSubmit() {
  if (!username.value || !password.value) return
  submitting.value = true
  try {
    if (props.needsSetup) {
      emit('setup', username.value, password.value)
    } else {
      emit('login', username.value, password.value)
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen paper-texture">
    <div class="w-full max-w-sm mx-4">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="relative inline-block mb-4">
          <div class="absolute -inset-6 bg-accent/5 rounded-full blur-2xl" />
          <svg class="relative w-14 h-14 text-accent/40" viewBox="0 0 80 80" fill="none">
            <rect x="14" y="10" width="52" height="60" rx="4" stroke="currentColor" stroke-width="1.5" />
            <path d="M14 10h4a4 4 0 0 1 4 4v52a4 4 0 0 1-4 4h-4" stroke="currentColor" stroke-width="1.5" />
            <line x1="30" y1="26" x2="56" y2="26" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            <line x1="30" y1="36" x2="50" y2="36" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.6" />
            <line x1="30" y1="46" x2="52" y2="46" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.4" />
          </svg>
        </div>
        <h1 class="font-serif text-2xl italic tracking-tight text-foreground/90">Notes</h1>
        <p class="text-sm text-muted-foreground/60 mt-1">
          {{ needsSetup ? 'Create your account to get started' : 'Sign in to continue' }}
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-foreground/70 mb-1.5">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            autocomplete="username"
            required
            :minlength="needsSetup ? 2 : undefined"
            class="w-full px-3 py-2 text-sm border border-border/50 rounded-lg bg-background/60 backdrop-blur-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring/40 transition-all duration-200"
            placeholder="Enter username"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-foreground/70 mb-1.5">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            :autocomplete="needsSetup ? 'new-password' : 'current-password'"
            required
            :minlength="needsSetup ? 6 : undefined"
            class="w-full px-3 py-2 text-sm border border-border/50 rounded-lg bg-background/60 backdrop-blur-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring/40 transition-all duration-200"
            placeholder="Enter password"
          />
          <p v-if="needsSetup" class="text-xs text-muted-foreground/50 mt-1">At least 6 characters</p>
        </div>

        <!-- Error message -->
        <p v-if="error" class="text-sm text-destructive">{{ error }}</p>

        <button
          type="submit"
          :disabled="!username || !password || submitting"
          class="w-full py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-200 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ submitting ? '...' : needsSetup ? 'Create account' : 'Sign in' }}
        </button>
      </form>
    </div>
  </div>
</template>
