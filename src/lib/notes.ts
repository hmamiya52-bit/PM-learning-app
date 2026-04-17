// ------------------------------------------------------------
// ノート CRUD（シードノート + ユーザ作成ノートをマージ）
// ------------------------------------------------------------

import { loadJSON, saveJSON } from './storage'
import type { Note, NoteCategory } from '../types'
import { SEED_NOTES } from '../data/notes'

const USER_NOTES_KEY = 'pm:notes:user'         // ユーザ作成／上書き
const HIDDEN_SEED_KEY = 'pm:notes:hiddenSeed'  // 非表示にしたシードノートid

function genId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function nowIso(): string {
  return new Date().toISOString()
}

// ---- Raw accessors ----
function loadUserNotes(): Note[] {
  const raw = loadJSON<unknown>(USER_NOTES_KEY, [])
  if (!Array.isArray(raw)) return []
  return raw.filter(
    (v): v is Note =>
      !!v &&
      typeof v === 'object' &&
      typeof (v as Note).id === 'string' &&
      typeof (v as Note).category === 'string' &&
      typeof (v as Note).title === 'string' &&
      typeof (v as Note).content === 'string' &&
      Array.isArray((v as Note).tags)
  )
}

function saveUserNotes(notes: Note[]): void {
  saveJSON(USER_NOTES_KEY, notes)
}

function loadHiddenSeedIds(): string[] {
  const raw = loadJSON<unknown>(HIDDEN_SEED_KEY, [])
  if (!Array.isArray(raw)) return []
  return raw.filter((v): v is string => typeof v === 'string')
}

function saveHiddenSeedIds(ids: string[]): void {
  saveJSON(HIDDEN_SEED_KEY, ids)
}

// ---- Public API ----
export function loadAllNotes(): Note[] {
  const userNotes = loadUserNotes()
  const hidden = new Set(loadHiddenSeedIds())
  // ユーザが同じidで上書きしていればuserNotesを優先
  const userIds = new Set(userNotes.map((n) => n.id))
  const seedVisible = SEED_NOTES.filter((n) => !hidden.has(n.id) && !userIds.has(n.id))
  return [...seedVisible, ...userNotes]
}

export interface AddNoteInput {
  category: NoteCategory
  title: string
  content: string
  tags?: string[]
}

export function addNote(input: AddNoteInput): Note {
  const now = nowIso()
  const note: Note = {
    id: genId(),
    category: input.category,
    title: input.title.trim() || '(無題)',
    content: input.content,
    tags: input.tags ?? [],
    createdAt: now,
    updatedAt: now,
  }
  const notes = loadUserNotes()
  notes.push(note)
  saveUserNotes(notes)
  return note
}

export interface UpdateNoteInput {
  title?: string
  content?: string
  tags?: string[]
  category?: NoteCategory
}

export function updateNote(id: string, input: UpdateNoteInput): Note | null {
  const notes = loadUserNotes()
  const idx = notes.findIndex((n) => n.id === id)

  if (idx >= 0) {
    // ユーザノートの更新
    const prev = notes[idx]
    const next: Note = {
      ...prev,
      ...input,
      title: input.title !== undefined ? input.title.trim() || '(無題)' : prev.title,
      updatedAt: nowIso(),
    }
    notes[idx] = next
    saveUserNotes(notes)
    return next
  }

  // シードノートの編集 → userNotesに複製して上書き保持
  const seed = SEED_NOTES.find((n) => n.id === id)
  if (seed) {
    const next: Note = {
      ...seed,
      ...input,
      seed: false, // 編集後はユーザノート扱い
      title: input.title !== undefined ? input.title.trim() || '(無題)' : seed.title,
      updatedAt: nowIso(),
    }
    notes.push(next)
    saveUserNotes(notes)
    return next
  }

  return null
}

export function deleteNote(id: string): void {
  // ユーザノートなら削除
  const notes = loadUserNotes()
  const next = notes.filter((n) => n.id !== id)
  if (next.length !== notes.length) {
    saveUserNotes(next)
    return
  }
  // シードノートなら非表示リストに追加
  const seed = SEED_NOTES.find((n) => n.id === id)
  if (seed) {
    const hidden = loadHiddenSeedIds()
    if (!hidden.includes(id)) {
      hidden.push(id)
      saveHiddenSeedIds(hidden)
    }
  }
}

export function resetSeedNotes(): void {
  saveHiddenSeedIds([])
}
