export interface Note {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

export interface CreateNote {
  title: string
  content: string
}

export interface UpdateNote {
  title?: string
  content?: string
}
