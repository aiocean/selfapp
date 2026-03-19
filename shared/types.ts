// --- Categories (multi-entity relationship example) ---

export interface Category {
  id: string
  name: string
  color: string
  created_at: string
}

export interface CreateCategory {
  name: string
  color?: string
}

export interface UpdateCategory {
  name?: string
  color?: string
}

// --- Notes (with optional category relationship) ---

export interface Note {
  id: string
  title: string
  content: string
  category_id: string | null
  created_at: string
  updated_at: string
}

/** Note joined with category name/color for display */
export interface NoteWithCategory extends Note {
  category_name: string | null
  category_color: string | null
}

export interface CreateNote {
  title: string
  content: string
  category_id?: string | null
}

export interface UpdateNote {
  title?: string
  content?: string
  category_id?: string | null
}

// Auth types
export interface User {
  id: string
  username: string
  created_at: string
}

export interface LoginInput {
  username: string
  password: string
}

export interface AuthStatus {
  needsSetup: boolean
  user: User | null
}
