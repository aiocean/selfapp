import { ref } from 'vue'
import type { Category, CreateCategory, UpdateCategory } from '@shared/types'
import { api } from './useApi'

const categories = ref<Category[]>([])
const loading = ref(false)

export function useCategories() {
  async function fetchCategories() {
    loading.value = true
    try {
      categories.value = await api.categoriesList()
    } finally {
      loading.value = false
    }
  }

  async function createCategory(input: CreateCategory) {
    const category = await api.categoriesCreate(input)
    categories.value.push(category)
    // Keep sorted by name
    categories.value.sort((a, b) => a.name.localeCompare(b.name))
    return category
  }

  async function updateCategory(id: string, input: UpdateCategory) {
    const updated = await api.categoriesUpdate(id, input)
    const idx = categories.value.findIndex((c) => c.id === id)
    if (idx !== -1) categories.value[idx] = updated
    categories.value.sort((a, b) => a.name.localeCompare(b.name))
    return updated
  }

  async function deleteCategory(id: string) {
    await api.categoriesDelete(id)
    categories.value = categories.value.filter((c) => c.id !== id)
  }

  return { categories, loading, fetchCategories, createCategory, updateCategory, deleteCategory }
}
