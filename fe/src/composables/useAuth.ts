import { ref, computed } from 'vue'
import { api } from './useApi'
import type { User } from '@shared/types'

const user = ref<User | null>(null)
const needsSetup = ref(false)
const loading = ref(true)
const error = ref('')

export function useAuth() {
  const isAuthenticated = computed(() => !!user.value)

  async function checkAuth() {
    loading.value = true
    error.value = ''
    try {
      const status = await api.authStatus()
      needsSetup.value = status.needsSetup
      user.value = status.user
    } catch {
      user.value = null
    } finally {
      loading.value = false
    }
  }

  async function setup(username: string, password: string) {
    error.value = ''
    try {
      const result = await api.authSetup({ username, password })
      user.value = result.user
      needsSetup.value = false
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Setup failed'
      throw e
    }
  }

  async function login(username: string, password: string) {
    error.value = ''
    try {
      const result = await api.authLogin({ username, password })
      user.value = result.user
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Login failed'
      throw e
    }
  }

  async function logout() {
    try {
      await api.authLogout()
    } finally {
      user.value = null
    }
  }

  return {
    user,
    needsSetup,
    loading,
    error,
    isAuthenticated,
    checkAuth,
    setup,
    login,
    logout,
  }
}
