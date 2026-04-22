// ------------------------------------------------------------
// 午後II 論述ドラフトの永続化
// ------------------------------------------------------------

import { loadJSON, saveJSON } from './storage'
import type { EssayDraft } from '../types'

const DRAFTS_KEY = 'pm:afternoon2:drafts'

function loadAll(): Record<string, EssayDraft> {
  const raw = loadJSON<unknown>(DRAFTS_KEY, {})
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  return raw as Record<string, EssayDraft>
}

function saveAll(map: Record<string, EssayDraft>): void {
  saveJSON(DRAFTS_KEY, map)
}

export function loadDraft(problemId: string): EssayDraft | null {
  const all = loadAll()
  return all[problemId] ?? null
}

export function saveDraft(draft: EssayDraft): void {
  const all = loadAll()
  all[draft.id] = draft
  saveAll(all)
}

export function upsertDraft(
  problemId: string,
  patch: Partial<Pick<EssayDraft, 'sectionA' | 'sectionB' | 'sectionC' | 'elapsedSec'>>
): EssayDraft {
  const existing = loadDraft(problemId)
  const now = new Date().toISOString()
  const next: EssayDraft = existing
    ? { ...existing, ...patch, updatedAt: now }
    : {
        id: problemId,
        problemId,
        sectionA: '',
        sectionB: '',
        sectionC: '',
        updatedAt: now,
        ...patch,
      }
  saveDraft(next)
  return next
}

export function deleteDraft(problemId: string): void {
  const all = loadAll()
  delete all[problemId]
  saveAll(all)
}

export function listDrafts(): EssayDraft[] {
  return Object.values(loadAll())
}

/**
 * 全角/半角を1文字としてカウント（改行と空白文字は除外）。
 * 原稿用紙換算の簡易版。
 */
export function countChars(text: string): number {
  if (!text) return 0
  // 改行・タブ・半角スペースを除いた文字数
  return text.replace(/[\s\u3000]/g, '').length
}
