// ------------------------------------------------------------
// 午後I演習の記録・学習計画の管理
// ------------------------------------------------------------

import { loadJSON, saveJSON } from './storage'
import type { PracticeRecord, PlanMap } from '../types'

const RECORDS_KEY = 'pm:afternoon1:records'
const PLANS_KEY = 'pm:afternoon1:plans'
const MY_ANSWER_PREFIX = 'pm:afternoon1:myAnswer:'

function genId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

// ---- PracticeRecord ----
export function loadRecords(): PracticeRecord[] {
  const raw = loadJSON<unknown>(RECORDS_KEY, [])
  if (!Array.isArray(raw)) return []
  return raw.filter(
    (v): v is PracticeRecord =>
      !!v &&
      typeof v === 'object' &&
      typeof (v as PracticeRecord).id === 'string' &&
      typeof (v as PracticeRecord).problemId === 'string' &&
      typeof (v as PracticeRecord).date === 'string' &&
      typeof (v as PracticeRecord).score === 'number'
  )
}

export function addRecord(data: Omit<PracticeRecord, 'id'>): PracticeRecord {
  const record: PracticeRecord = { id: genId(), ...data }
  const records = loadRecords()
  records.push(record)
  saveJSON(RECORDS_KEY, records)
  return record
}

export function deleteRecord(id: string): void {
  const next = loadRecords().filter((r) => r.id !== id)
  saveJSON(RECORDS_KEY, next)
}

export function getRecordsForProblem(problemId: string): PracticeRecord[] {
  return loadRecords()
    .filter((r) => r.problemId === problemId)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

// ---- PlanMap ----
export function loadPlans(): PlanMap {
  const raw = loadJSON<unknown>(PLANS_KEY, {})
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  const entries = Object.entries(raw as Record<string, unknown>).filter(
    ([k, v]) => typeof k === 'string' && typeof v === 'string'
  ) as [string, string][]
  return Object.fromEntries(entries)
}

export function setPlan(problemId: string, date: string): void {
  const plans = loadPlans()
  plans[problemId] = date
  saveJSON(PLANS_KEY, plans)
}

export function removePlan(problemId: string): void {
  const plans = loadPlans()
  delete plans[problemId]
  saveJSON(PLANS_KEY, plans)
}

// ---- 自分の解答（下書き保存） ----
export function loadMyAnswer(problemId: string): Record<string, string> {
  return loadJSON<Record<string, string>>(MY_ANSWER_PREFIX + problemId, {})
}

export function saveMyAnswer(
  problemId: string,
  answers: Record<string, string>
): void {
  saveJSON(MY_ANSWER_PREFIX + problemId, answers)
}

// ---- 満点（午後Iは100点満点、2問選択・各問50点配分） ----
export function getMaxScore(): number {
  return 100
}
