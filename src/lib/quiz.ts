// ------------------------------------------------------------
// クイズ解答履歴の記録
// ------------------------------------------------------------

import { loadJSON, saveJSON } from './storage'
import type { QuizAttempt } from '../types'

const ATTEMPTS_KEY = 'pm:quiz:attempts'

function genId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `att-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function loadAttempts(): QuizAttempt[] {
  const raw = loadJSON<unknown>(ATTEMPTS_KEY, [])
  if (!Array.isArray(raw)) return []
  return raw.filter(
    (v): v is QuizAttempt =>
      !!v &&
      typeof v === 'object' &&
      typeof (v as QuizAttempt).id === 'string' &&
      typeof (v as QuizAttempt).quizId === 'string' &&
      typeof (v as QuizAttempt).correct === 'boolean' &&
      typeof (v as QuizAttempt).pickedIndex === 'number'
  )
}

export function addAttempt(data: Omit<QuizAttempt, 'id'>): QuizAttempt {
  const attempt: QuizAttempt = { id: genId(), ...data }
  const attempts = loadAttempts()
  attempts.push(attempt)
  saveJSON(ATTEMPTS_KEY, attempts)
  return attempt
}

/**
 * クイズIDごとの最新解答成否を返す
 */
export function getLatestAttemptMap(): Record<string, QuizAttempt> {
  const map: Record<string, QuizAttempt> = {}
  for (const a of loadAttempts()) {
    const prev = map[a.quizId]
    if (!prev || a.date > prev.date) {
      map[a.quizId] = a
    }
  }
  return map
}

/**
 * 全体サマリ
 */
export interface QuizStats {
  total: number
  answered: number
  correct: number
  accuracy: number  // 0-100
}

export function computeStats(totalQuizzes: number): QuizStats {
  const attempts = loadAttempts()
  const latest = getLatestAttemptMap()
  const answeredIds = Object.keys(latest)
  const correct = answeredIds.filter((id) => latest[id]?.correct).length
  return {
    total: totalQuizzes,
    answered: answeredIds.length,
    correct,
    accuracy: attempts.length === 0 ? 0 : Math.round((correct / Math.max(answeredIds.length, 1)) * 100),
  }
}

export function clearAttempts(): void {
  saveJSON(ATTEMPTS_KEY, [])
}
