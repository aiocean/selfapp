import type { Note, CreateNote, UpdateNote } from './types'

export type RpcMap = {
  'notes.list': { input: { query?: string }; output: Note[] }
  'notes.get': { input: { id: string }; output: Note }
  'notes.create': { input: CreateNote; output: Note }
  'notes.update': { input: UpdateNote; output: Note }
  'notes.delete': { input: { id: string }; output: void }
}

export type RpcMethod = keyof RpcMap
