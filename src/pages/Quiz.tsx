import { useMemo, useState, useCallback, useEffect } from 'react'
import type { NoteCategory, QuizDifficulty, QuizQuestion } from '../types'
import { QUIZZES } from '../data/quizzes'
import { NOTE_CATEGORIES, getCategoryMeta } from '../data/noteCategories'
import { addAttempt, getLatestAttemptMap, computeStats, clearAttempts } from '../lib/quiz'

const THEME = {
  primary: '#7B2D5F',
  primaryDark: '#4A1A38',
  primaryLight: '#A04080',
  accent: '#D4A5C0',
  bgSoft: '#FAF5F8',
}

type CategoryFilter = NoteCategory | 'all'
type DifficultyFilter = QuizDifficulty | 'all'

interface SessionState {
  questions: QuizQuestion[]
  index: number
  picked: number | null
  showAnswer: boolean
  correctCount: number
  startMs: number
  questionStartMs: number
  finished: boolean
  results: Array<{ quizId: string; correct: boolean; pickedIndex: number; timeMs: number }>
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Quiz() {
  const [filter, setFilter] = useState<CategoryFilter>('all')
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all')
  const [count, setCount] = useState(10)
  const [session, setSession] = useState<SessionState | null>(null)
  const [latestMap, setLatestMap] = useState(() => getLatestAttemptMap())
  const stats = useMemo(() => computeStats(QUIZZES.length), [latestMap])

  const today = () => new Date().toISOString().slice(0, 10)

  const pool = useMemo(() => {
    return QUIZZES.filter(
      (q) =>
        (filter === 'all' || q.category === filter) &&
        (difficulty === 'all' || q.difficulty === difficulty)
    )
  }, [filter, difficulty])

  const categoryCounts = useMemo(() => {
    const map = new Map<NoteCategory, number>()
    for (const q of QUIZZES) map.set(q.category, (map.get(q.category) ?? 0) + 1)
    return map
  }, [])

  const startSession = useCallback(() => {
    if (pool.length === 0) return
    const n = Math.max(1, Math.min(count, pool.length))
    const picked = shuffle(pool).slice(0, n)
    const now = Date.now()
    setSession({
      questions: picked,
      index: 0,
      picked: null,
      showAnswer: false,
      correctCount: 0,
      startMs: now,
      questionStartMs: now,
      finished: false,
      results: [],
    })
  }, [pool, count])

  const handleAnswer = useCallback(
    (idx: number) => {
      setSession((prev) => {
        if (!prev || prev.showAnswer) return prev
        const q = prev.questions[prev.index]
        const correct = idx === q.correctIndex
        const timeMs = Date.now() - prev.questionStartMs
        addAttempt({
          quizId: q.id,
          date: today(),
          correct,
          pickedIndex: idx,
          timeMs,
        })
        return {
          ...prev,
          picked: idx,
          showAnswer: true,
          correctCount: prev.correctCount + (correct ? 1 : 0),
          results: [...prev.results, { quizId: q.id, correct, pickedIndex: idx, timeMs }],
        }
      })
    },
    []
  )

  const handleNext = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev
      const next = prev.index + 1
      if (next >= prev.questions.length) {
        return { ...prev, finished: true }
      }
      return {
        ...prev,
        index: next,
        picked: null,
        showAnswer: false,
        questionStartMs: Date.now(),
      }
    })
  }, [])

  const handleFinish = useCallback(() => {
    setSession(null)
    setLatestMap(getLatestAttemptMap())
  }, [])

  // セッション終了時に最新記録を反映
  useEffect(() => {
    if (session?.finished) {
      setLatestMap(getLatestAttemptMap())
    }
  }, [session?.finished])

  // ===== セッション中の表示 =====
  if (session && !session.finished) {
    const q = session.questions[session.index]
    const meta = getCategoryMeta(q.category)
    const total = session.questions.length

    return (
      <div className="max-w-3xl mx-auto px-4 py-5">
        <header className="mb-3 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {session.index + 1} / {total} 問
          </div>
          <div className="text-xs" style={{ color: THEME.primary }}>
            正解: {session.correctCount}
          </div>
        </header>

        {/* プログレスバー */}
        <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden mb-4">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${((session.index + (session.showAnswer ? 1 : 0)) / total) * 100}%`,
              backgroundColor: THEME.primary,
            }}
          />
        </div>

        <section className="rounded-lg bg-white border border-slate-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded"
              style={{
                color: THEME.primary,
                backgroundColor: THEME.bgSoft,
                border: `1px solid ${THEME.accent}`,
              }}
            >
              {meta.label}
            </span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
              {q.difficulty === 'easy' ? '易' : q.difficulty === 'normal' ? '普' : '難'}
            </span>
          </div>
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed mb-4">
            {q.question}
          </p>

          <ul className="space-y-2">
            {q.choices.map((choice, idx) => {
              const isPicked = session.picked === idx
              const isCorrect = idx === q.correctIndex
              const showResult = session.showAnswer

              let border = 'border-slate-200'
              let bg = 'bg-white'
              let textColor = 'text-slate-700'
              if (showResult) {
                if (isCorrect) {
                  border = 'border-green-400'
                  bg = 'bg-green-50'
                  textColor = 'text-green-800'
                } else if (isPicked) {
                  border = 'border-red-300'
                  bg = 'bg-red-50'
                  textColor = 'text-red-700'
                }
              } else if (isPicked) {
                border = ''
                bg = ''
              }

              return (
                <li key={idx}>
                  <button
                    onClick={() => handleAnswer(idx)}
                    disabled={showResult}
                    className={`w-full text-left border rounded-lg px-3 py-2 transition-colors ${border} ${bg} ${textColor} ${
                      !showResult ? 'hover:bg-slate-50' : 'cursor-default'
                    }`}
                    style={
                      !showResult && isPicked
                        ? {
                            borderColor: THEME.primary,
                            backgroundColor: THEME.bgSoft,
                            color: THEME.primaryDark,
                          }
                        : undefined
                    }
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className="flex-shrink-0 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor:
                            showResult && isCorrect
                              ? '#10b981'
                              : showResult && isPicked
                              ? '#ef4444'
                              : THEME.accent,
                          color: '#ffffff',
                        }}
                      >
                        {['ア', 'イ', 'ウ', 'エ'][idx] ?? idx + 1}
                      </span>
                      <span className="text-sm leading-relaxed flex-1">{choice}</span>
                      {showResult && isCorrect && (
                        <span className="text-xs font-bold text-green-700">✓ 正解</span>
                      )}
                      {showResult && isPicked && !isCorrect && (
                        <span className="text-xs font-bold text-red-700">✗</span>
                      )}
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>

          {/* 解説 */}
          {session.showAnswer && (
            <div
              className="mt-4 rounded border px-3 py-2.5"
              style={{ borderColor: THEME.accent, backgroundColor: THEME.bgSoft }}
            >
              <p className="text-[10px] font-bold mb-1" style={{ color: THEME.primary }}>
                解説
              </p>
              <p className="text-xs text-slate-700 leading-relaxed">{q.explanation}</p>
            </div>
          )}
        </section>

        {/* 次へ/終了 */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={handleFinish}
            className="text-xs font-semibold px-3 py-1.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-50"
          >
            中断
          </button>
          {session.showAnswer && (
            <button
              onClick={handleNext}
              className="text-sm font-semibold px-4 py-1.5 rounded text-white hover:opacity-90"
              style={{ backgroundColor: THEME.primary }}
            >
              {session.index + 1 >= total ? '結果を見る →' : '次の問題 →'}
            </button>
          )}
        </div>
      </div>
    )
  }

  // ===== セッション終了（結果画面） =====
  if (session && session.finished) {
    const total = session.questions.length
    const accuracy = Math.round((session.correctCount / total) * 100)
    const durationSec = Math.round((Date.now() - session.startMs) / 1000)

    return (
      <div className="max-w-3xl mx-auto px-4 py-5">
        <section
          className="rounded-lg p-5 text-white shadow-md mb-4"
          style={{
            background: `linear-gradient(135deg, ${THEME.primaryDark} 0%, ${THEME.primary} 100%)`,
          }}
        >
          <h2 className="text-lg font-black mb-2">クイズ結果</h2>
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-4xl font-black">{session.correctCount}</span>
            <span className="text-sm opacity-80">/ {total} 問正解</span>
            <span className="text-xs opacity-80">（正答率 {accuracy}%）</span>
          </div>
          <p className="text-[11px] opacity-70 mt-1">所要時間: {durationSec} 秒</p>
        </section>

        {/* 振り返り */}
        <section className="rounded-lg bg-white border border-slate-200 shadow-sm overflow-hidden">
          <h3
            className="text-xs font-bold px-3 py-2"
            style={{ backgroundColor: THEME.bgSoft, color: THEME.primaryDark }}
          >
            振り返り
          </h3>
          <ul>
            {session.questions.map((q, i) => {
              const r = session.results[i]
              return (
                <li key={q.id} className="border-t border-slate-100 px-3 py-2">
                  <div className="flex items-start gap-2">
                    <span
                      className="flex-shrink-0 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: r?.correct ? '#10b981' : '#ef4444' }}
                    >
                      {r?.correct ? '○' : '×'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-700 truncate">{q.question}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {!r?.correct && `あなた: ${['ア', 'イ', 'ウ', 'エ'][r?.pickedIndex ?? 0]} / `}
                        正解: {['ア', 'イ', 'ウ', 'エ'][q.correctIndex]}
                      </p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={handleFinish}
            className="text-sm font-semibold px-4 py-1.5 rounded text-white hover:opacity-90"
            style={{ backgroundColor: THEME.primary }}
          >
            設定に戻る
          </button>
        </div>
      </div>
    )
  }

  // ===== 通常（セットアップ）画面 =====
  return (
    <div className="max-w-5xl mx-auto px-4 py-5">
      {/* ===== ヘッダ ===== */}
      <header className="mb-4">
        <h1 className="text-xl sm:text-2xl font-bold" style={{ color: THEME.primaryDark }}>
          クイズ（択一問題）
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          PM試験の頻出テーマを4択で確認。カテゴリ・難易度・問題数を選んで挑戦しましょう。
        </p>
      </header>

      {/* ===== サマリ ===== */}
      <section className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-white border border-slate-200 shadow-sm px-3 py-2.5 text-center">
          <p className="text-[10px] text-slate-500">全問題</p>
          <p className="text-lg font-black" style={{ color: THEME.primaryDark }}>
            {stats.total}
          </p>
        </div>
        <div className="rounded-lg bg-white border border-slate-200 shadow-sm px-3 py-2.5 text-center">
          <p className="text-[10px] text-slate-500">解答済</p>
          <p className="text-lg font-black" style={{ color: THEME.primary }}>
            {stats.answered}
          </p>
        </div>
        <div className="rounded-lg bg-white border border-slate-200 shadow-sm px-3 py-2.5 text-center">
          <p className="text-[10px] text-slate-500">正答率</p>
          <p className="text-lg font-black" style={{ color: '#10b981' }}>
            {stats.accuracy}%
          </p>
        </div>
      </section>

      {/* ===== 設定 ===== */}
      <section className="mb-4 rounded-lg bg-white border border-slate-200 shadow-sm p-4 space-y-3">
        {/* カテゴリ */}
        <div>
          <p className="text-xs font-semibold text-slate-600 mb-1.5">カテゴリ</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilter('all')}
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: filter === 'all' ? THEME.primary : '#ffffff',
                color: filter === 'all' ? '#ffffff' : THEME.primary,
                border: `1px solid ${THEME.accent}`,
              }}
            >
              すべて ({QUIZZES.length})
            </button>
            {NOTE_CATEGORIES.map((c) => {
              const n = categoryCounts.get(c.key) ?? 0
              if (n === 0) return null
              const active = filter === c.key
              return (
                <button
                  key={c.key}
                  onClick={() => setFilter(c.key)}
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: active ? THEME.primary : '#ffffff',
                    color: active ? '#ffffff' : THEME.primary,
                    border: `1px solid ${THEME.accent}`,
                  }}
                >
                  {c.label} ({n})
                </button>
              )
            })}
          </div>
        </div>

        {/* 難易度 */}
        <div>
          <p className="text-xs font-semibold text-slate-600 mb-1.5">難易度</p>
          <div className="flex gap-1.5">
            {(['all', 'easy', 'normal', 'hard'] as DifficultyFilter[]).map((d) => {
              const active = difficulty === d
              const label =
                d === 'all' ? 'すべて' : d === 'easy' ? '易' : d === 'normal' ? '普' : '難'
              return (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: active ? THEME.primary : '#ffffff',
                    color: active ? '#ffffff' : THEME.primary,
                    border: `1px solid ${THEME.accent}`,
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* 問題数 */}
        <div>
          <p className="text-xs font-semibold text-slate-600 mb-1.5">
            問題数: <span style={{ color: THEME.primary }}>{Math.min(count, pool.length)}</span>
            <span className="text-[10px] text-slate-400 ml-2">
              （候補: {pool.length} 問）
            </span>
          </p>
          <div className="flex gap-1.5">
            {[5, 10, 20, 30].map((c) => (
              <button
                key={c}
                onClick={() => setCount(c)}
                disabled={pool.length === 0}
                className="text-xs font-semibold px-3 py-1 rounded-full disabled:opacity-40"
                style={{
                  backgroundColor: count === c ? THEME.primary : '#ffffff',
                  color: count === c ? '#ffffff' : THEME.primary,
                  border: `1px solid ${THEME.accent}`,
                }}
              >
                {c}問
              </button>
            ))}
          </div>
        </div>

        {/* 開始 */}
        <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
          <button
            onClick={() => {
              if (window.confirm('解答履歴をすべて削除しますか？')) {
                clearAttempts()
                setLatestMap({})
              }
            }}
            className="text-[11px] text-slate-400 hover:text-red-500 underline"
          >
            解答履歴をリセット
          </button>
          <button
            onClick={startSession}
            disabled={pool.length === 0}
            className="text-sm font-bold px-5 py-2 rounded text-white shadow-md hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: THEME.primary }}
          >
            クイズを始める →
          </button>
        </div>
      </section>

      <p className="text-[10px] text-slate-400">
        ※ 各問題は最新の解答結果だけが「正答率」に反映されます。
      </p>
    </div>
  )
}
