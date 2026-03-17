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
  id: string
  title?: string
  content?: string
}

export type RpcMap = {
  'notes.list': { input: { query?: string }; output: Note[] }
  'notes.get': { input: { id: string }; output: Note }
  'notes.create': { input: CreateNote; output: Note }
  'notes.update': { input: UpdateNote; output: Note }
  'notes.delete': { input: { id: string }; output: void }
}

export type RpcMethod = keyof RpcMap
