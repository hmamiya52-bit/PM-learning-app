// ------------------------------------------------------------
// ネタ帳（エピソード）の CRUD
// ------------------------------------------------------------

import { loadJSON, saveJSON } from './storage'
import type { Episode, EpisodeTag } from '../types'

const EPISODES_KEY = 'pm:episodes'

function genId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `ep-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function loadEpisodes(): Episode[] {
  const raw = loadJSON<unknown>(EPISODES_KEY, [])
  if (!Array.isArray(raw)) return []
  return raw.filter(
    (v): v is Episode =>
      !!v &&
      typeof v === 'object' &&
      typeof (v as Episode).id === 'string' &&
      typeof (v as Episode).title === 'string'
  )
}

export function saveEpisodes(list: Episode[]): void {
  saveJSON(EPISODES_KEY, list)
}

export function addEpisode(
  data: Omit<Episode, 'id' | 'createdAt' | 'updatedAt'>
): Episode {
  const now = new Date().toISOString()
  const ep: Episode = {
    id: genId(),
    createdAt: now,
    updatedAt: now,
    ...data,
  }
  const list = loadEpisodes()
  list.push(ep)
  saveEpisodes(list)
  return ep
}

export function updateEpisode(
  id: string,
  patch: Partial<Omit<Episode, 'id' | 'createdAt'>>
): Episode | null {
  const list = loadEpisodes()
  const idx = list.findIndex((e) => e.id === id)
  if (idx < 0) return null
  const next: Episode = {
    ...list[idx],
    ...patch,
    id: list[idx].id,
    createdAt: list[idx].createdAt,
    updatedAt: new Date().toISOString(),
  }
  list[idx] = next
  saveEpisodes(list)
  return next
}

export function deleteEpisode(id: string): void {
  const list = loadEpisodes().filter((e) => e.id !== id)
  saveEpisodes(list)
}

export const EPISODE_TAG_LABEL: Record<EpisodeTag, string> = {
  integration: '統合',
  scope: 'スコープ',
  schedule: 'スケジュール',
  cost: 'コスト',
  quality: '品質',
  resource: '資源',
  communication: 'コミュ',
  risk: 'リスク',
  procurement: '調達',
  stakeholder: 'SH',
  agile: 'アジャイル',
  other: 'その他',
}

export const EPISODE_TAG_KEYS: EpisodeTag[] = [
  'integration',
  'scope',
  'schedule',
  'cost',
  'quality',
  'resource',
  'communication',
  'risk',
  'procurement',
  'stakeholder',
  'agile',
  'other',
]
