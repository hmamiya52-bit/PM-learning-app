import type { NoteCategory } from '../types'

export interface NoteCategoryMeta {
  key: NoteCategory
  label: string      // 表示名（日本語）
  short: string      // 短縮名
  order: number
}

export const NOTE_CATEGORIES: NoteCategoryMeta[] = [
  { key: 'integration',   label: '統合管理',           short: '統合',       order: 1 },
  { key: 'scope',         label: 'スコープ管理',        short: 'スコープ',   order: 2 },
  { key: 'schedule',      label: 'スケジュール管理',    short: 'スケジュール', order: 3 },
  { key: 'cost',          label: 'コスト管理',          short: 'コスト',     order: 4 },
  { key: 'quality',       label: '品質管理',            short: '品質',       order: 5 },
  { key: 'resource',      label: '資源管理',            short: '資源',       order: 6 },
  { key: 'communication', label: 'コミュニケーション管理', short: 'コミュ',   order: 7 },
  { key: 'risk',          label: 'リスク管理',          short: 'リスク',     order: 8 },
  { key: 'procurement',   label: '調達管理',            short: '調達',       order: 9 },
  { key: 'stakeholder',   label: 'ステークホルダー管理', short: 'SH',        order: 10 },
  { key: 'process',       label: 'プロセス群',          short: 'プロセス',   order: 11 },
  { key: 'agile',         label: 'アジャイル/ハイブリッド', short: 'アジャイル', order: 12 },
  { key: 'exam',          label: '試験対策Tips',        short: '対策',       order: 13 },
]

const map = new Map(NOTE_CATEGORIES.map((c) => [c.key, c]))

export function getCategoryMeta(key: NoteCategory): NoteCategoryMeta {
  return map.get(key) ?? NOTE_CATEGORIES[0]
}
