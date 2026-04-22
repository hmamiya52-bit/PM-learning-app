import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadRecords, deleteRecord } from '../lib/tracker'
import { loadAttempts, clearAttempts } from '../lib/quiz'
import { afternoon1Problems } from '../data/afternoon1Problems'
import { QUIZZES } from '../data/quizzes'
import { NOTE_CATEGORIES } from '../data/noteCategories'
import type { NoteCategory, PracticeRecord, QuizAttempt } from '../types'

const THEME = {
  primary: '#7B2D5F',
  primaryDark: '#4A1A38',
  primaryLight: '#A04080',
  accent: '#D4A5C0',
  bgSoft: '#FAF5F8',
}

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
function fmtDuration(sec?: number): string {
  if (!sec || sec <= 0) return '–'
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a)
  const db = new Date(b)
  return Math.round((db.getTime() - da.getTime()) / (24 * 60 * 60 * 1000))
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function computeStreak(dates: Set<string>): number {
  if (dates.size === 0) return 0
  let streak = 0
  const d = new Date()
  // 今日が未学習でも、昨日が学習済みならstreakは継続していない扱い（NWSP流）
  while (true) {
    const key = d.toISOString().slice(0, 10)
    if (dates.has(key)) {
      streak += 1
      d.setDate(d.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}

// ------------------------------------------------------------
// Sparkline: 午後I スコア推移
// ------------------------------------------------------------
interface ScoreSparkProps {
  points: { date: string; score: number }[]
}

function ScoreSparkline({ points }: ScoreSparkProps) {
  if (points.length === 0) {
    return (
      <p className="text-xs text-slate-400 text-center py-8">
        まだ演習記録がありません
      </p>
    )
  }
  const width = 560
  const height = 140
  const padX = 28
  const padY = 16
  const maxScore = 100
  const minScore = 0

  const stepX = points.length > 1 ? (width - padX * 2) / (points.length - 1) : 0

  const pts = points.map((p, i) => {
    const x = padX + stepX * i
    const y =
      padY +
      (1 - (p.score - minScore) / (maxScore - minScore)) * (height - padY * 2)
    return { x, y, score: p.score, date: p.date }
  })

  const pathD = pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ')

  const avg =
    points.reduce((acc, p) => acc + p.score, 0) / points.length
  const avgY =
    padY + (1 - avg / maxScore) * (height - padY * 2)

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      className="overflow-visible"
      aria-label="午後Iスコアの推移"
    >
      {/* Y軸ラベル */}
      {[0, 50, 100].map((v) => {
        const y = padY + (1 - v / maxScore) * (height - padY * 2)
        return (
          <g key={v}>
            <line x1={padX} x2={width - padX} y1={y} y2={y} stroke="#e5e7eb" strokeWidth={1} />
            <text x={4} y={y + 3} fontSize={9} fill="#94a3b8">
              {v}
            </text>
          </g>
        )
      })}
      {/* 合格ライン 60 */}
      {(() => {
        const y = padY + (1 - 60 / maxScore) * (height - padY * 2)
        return (
          <g>
            <line
              x1={padX}
              x2={width - padX}
              y1={y}
              y2={y}
              stroke="#10b981"
              strokeDasharray="4 2"
              strokeWidth={1}
            />
            <text x={width - padX + 2} y={y + 3} fontSize={9} fill="#10b981">
              60
            </text>
          </g>
        )
      })()}
      {/* 平均線 */}
      <line
        x1={padX}
        x2={width - padX}
        y1={avgY}
        y2={avgY}
        stroke={THEME.primaryLight}
        strokeDasharray="2 2"
        strokeWidth={1}
      />
      {/* ライン */}
      <path d={pathD} fill="none" stroke={THEME.primary} strokeWidth={2} />
      {/* 点 */}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={3.5} fill={THEME.primary} />
          <title>
            {p.date} : {p.score}点
          </title>
        </g>
      ))}
    </svg>
  )
}

// ------------------------------------------------------------
// GitHub風 学習カレンダー（過去12週）
// ------------------------------------------------------------
interface CalendarProps {
  activityByDate: Map<string, number> // date → count
}

function StudyCalendar({ activityByDate }: CalendarProps) {
  const weeks = 12
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  // 今日が含まれる週の日曜日まで含めるため、曜日を合わせる
  const end = new Date(today)
  const start = new Date(today)
  start.setDate(start.getDate() - (weeks * 7 - 1))

  const days: { date: string; count: number }[] = []
  const cursor = new Date(start)
  while (cursor <= end) {
    const key = cursor.toISOString().slice(0, 10)
    days.push({ date: key, count: activityByDate.get(key) ?? 0 })
    cursor.setDate(cursor.getDate() + 1)
  }

  // 曜日グリッドへ（日=0 〜 土=6）
  const grid: Array<Array<(typeof days)[number] | null>> = []
  const firstDow = new Date(start).getDay()
  let currentWeek: Array<(typeof days)[number] | null> = Array(firstDow).fill(null)
  for (const d of days) {
    currentWeek.push(d)
    if (currentWeek.length === 7) {
      grid.push(currentWeek)
      currentWeek = []
    }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null)
    grid.push(currentWeek)
  }

  const colorFor = (c: number): string => {
    if (c === 0) return '#f1f5f9'
    if (c === 1) return THEME.accent
    if (c === 2) return THEME.primaryLight
    if (c === 3) return THEME.primary
    return THEME.primaryDark
  }

  return (
    <div className="flex gap-0.5 overflow-x-auto">
      <div className="flex flex-col justify-around pr-1 text-[9px] text-slate-400">
        <span>月</span>
        <span>水</span>
        <span>金</span>
      </div>
      {grid.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-0.5">
          {week.map((d, di) =>
            d ? (
              <div
                key={di}
                title={`${d.date}: ${d.count} 件`}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: colorFor(d.count) }}
              />
            ) : (
              <div key={di} className="w-3 h-3" />
            )
          )}
        </div>
      ))}
    </div>
  )
}

// ------------------------------------------------------------
// Tracker ページ本体
// ------------------------------------------------------------
export default function Tracker() {
  const [records, setRecords] = useState<PracticeRecord[]>(() => loadRecords())
  const [attempts, setAttempts] = useState<QuizAttempt[]>(() => loadAttempts())

  const reload = () => {
    setRecords(loadRecords())
    setAttempts(loadAttempts())
  }

  // ----- 午後I 統計 -----
  const recordsSorted = useMemo(
    () =>
      [...records].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0)),
    [records]
  )
  const studiedIds = useMemo(() => new Set(records.map((r) => r.problemId)), [records])
  const avgScore = useMemo(() => {
    if (records.length === 0) return 0
    return Math.round(
      records.reduce((a, r) => a + r.score, 0) / records.length
    )
  }, [records])
  const maxScore = useMemo(
    () => records.reduce((m, r) => (r.score > m ? r.score : m), 0),
    [records]
  )
  const totalDurationSec = useMemo(
    () => records.reduce((a, r) => a + (r.durationSec ?? 0), 0),
    [records]
  )

  // 問題ごとのベストスコア
  const bestByProblem = useMemo(() => {
    const map = new Map<string, PracticeRecord>()
    for (const r of records) {
      const cur = map.get(r.problemId)
      if (!cur || r.score > cur.score) map.set(r.problemId, r)
    }
    return map
  }, [records])

  // ----- クイズ 統計 -----
  const latestAttemptMap = useMemo(() => {
    const map = new Map<string, QuizAttempt>()
    for (const a of attempts) {
      const prev = map.get(a.quizId)
      if (!prev || a.date > prev.date) map.set(a.quizId, a)
    }
    return map
  }, [attempts])
  const quizAnswered = latestAttemptMap.size
  const quizCorrect = useMemo(
    () => Array.from(latestAttemptMap.values()).filter((a) => a.correct).length,
    [latestAttemptMap]
  )
  const quizAccuracy =
    quizAnswered === 0 ? 0 : Math.round((quizCorrect / quizAnswered) * 100)

  // カテゴリ別正答率
  const categoryAccuracy = useMemo(() => {
    const map = new Map<NoteCategory, { total: number; correct: number }>()
    for (const q of QUIZZES) {
      const a = latestAttemptMap.get(q.id)
      if (!a) continue
      const cur = map.get(q.category) ?? { total: 0, correct: 0 }
      cur.total += 1
      if (a.correct) cur.correct += 1
      map.set(q.category, cur)
    }
    return map
  }, [latestAttemptMap])

  // ----- 共通：活動日セット・連続日数 -----
  const activityDates = useMemo(() => {
    const s = new Set<string>()
    for (const r of records) s.add(r.date)
    for (const a of attempts) s.add(a.date)
    return s
  }, [records, attempts])
  const streak = useMemo(() => computeStreak(activityDates), [activityDates])

  const activityByDate = useMemo(() => {
    const m = new Map<string, number>()
    for (const r of records) m.set(r.date, (m.get(r.date) ?? 0) + 1)
    for (const a of attempts) m.set(a.date, (m.get(a.date) ?? 0) + 1)
    return m
  }, [records, attempts])

  // 今週の学習時間（午後Iタイマーのみ）
  const thisWeekDurationSec = useMemo(() => {
    const now = new Date()
    const start = new Date(now)
    start.setDate(start.getDate() - 6)
    start.setHours(0, 0, 0, 0)
    const startStr = start.toISOString().slice(0, 10)
    return records
      .filter((r) => r.date >= startStr)
      .reduce((a, r) => a + (r.durationSec ?? 0), 0)
  }, [records])

  const lastActivityDate = useMemo(() => {
    const dates = Array.from(activityDates).sort()
    return dates[dates.length - 1] ?? null
  }, [activityDates])

  const sinceLastDays =
    lastActivityDate ? daysBetween(lastActivityDate, todayStr()) : null

  // 最近の活動（最新10件の演習＋クイズセッション統合）
  const recentEvents = useMemo(() => {
    const events: Array<
      | { type: 'practice'; date: string; title: string; detail: string; time: string }
      | { type: 'quiz'; date: string; title: string; detail: string; time: string }
    > = []

    for (const r of records) {
      const p = afternoon1Problems.find((x) => x.id === r.problemId)
      events.push({
        type: 'practice',
        date: r.date,
        title: p ? `${p.year} 問${p.number}：${p.title}` : r.problemId,
        detail: `${r.score} 点${r.durationSec ? ` / ${fmtDuration(r.durationSec)}` : ''}`,
        time: r.date,
      })
    }
    // クイズはその日の最後の解答をまとめる（件数・正解数）
    const quizByDay = new Map<string, { total: number; correct: number }>()
    for (const a of attempts) {
      const cur = quizByDay.get(a.date) ?? { total: 0, correct: 0 }
      cur.total += 1
      if (a.correct) cur.correct += 1
      quizByDay.set(a.date, cur)
    }
    for (const [date, v] of quizByDay.entries()) {
      events.push({
        type: 'quiz',
        date,
        title: 'クイズに解答',
        detail: `${v.correct} / ${v.total} 正解`,
        time: date,
      })
    }
    return events.sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 10)
  }, [records, attempts])

  // ----- 履歴操作 -----
  const handleDeleteRecord = (id: string) => {
    if (!window.confirm('この演習記録を削除しますか？')) return
    deleteRecord(id)
    reload()
  }
  const handleClearQuiz = () => {
    if (!window.confirm('クイズの解答履歴をすべて削除しますか？')) return
    clearAttempts()
    reload()
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-5">
      {/* ===== ヘッダ ===== */}
      <header className="mb-4">
        <h1 className="text-xl sm:text-2xl font-bold" style={{ color: THEME.primaryDark }}>
          進捗トラッカー
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          午後I演習とクイズの記録を一元表示。スコア推移・学習カレンダー・カテゴリ別正答率を可視化します。
        </p>
      </header>

      {/* ===== サマリカード ===== */}
      <section className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        <StatCard
          label="連続学習日数"
          value={`${streak} 日`}
          sub={sinceLastDays != null ? `最終: ${sinceLastDays} 日前` : '未学習'}
          accent={streak > 0 ? '#10b981' : '#94a3b8'}
        />
        <StatCard
          label="午後I 学習済"
          value={`${studiedIds.size} / ${afternoon1Problems.length}`}
          sub={`平均 ${avgScore} 点 / 最高 ${maxScore}`}
          accent={THEME.primary}
        />
        <StatCard
          label="クイズ正答率"
          value={`${quizAccuracy}%`}
          sub={`${quizAnswered} / ${QUIZZES.length} 問解答`}
          accent={THEME.primaryLight}
        />
        <StatCard
          label="今週の演習時間"
          value={fmtDuration(thisWeekDurationSec)}
          sub={`総計 ${fmtDuration(totalDurationSec)}`}
          accent={THEME.primaryDark}
        />
      </section>

      {/* ===== スコア推移 ===== */}
      <section className="mb-4 rounded-lg bg-white border shadow-sm p-4" style={{ borderColor: THEME.accent }}>
        <h2 className="text-sm font-bold mb-3" style={{ color: THEME.primaryDark }}>
          午後I スコア推移
          {records.length > 0 && (
            <span className="ml-2 text-[11px] font-normal text-slate-500">
              直近 {Math.min(records.length, 30)} 件
            </span>
          )}
        </h2>
        <ScoreSparkline
          points={recordsSorted.slice(-30).map((r) => ({
            date: r.date,
            score: r.score,
          }))}
        />
      </section>

      {/* ===== 学習カレンダー ===== */}
      <section className="mb-4 rounded-lg bg-white border shadow-sm p-4" style={{ borderColor: THEME.accent }}>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-sm font-bold" style={{ color: THEME.primaryDark }}>
            学習カレンダー（過去12週）
          </h2>
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <span>少</span>
            {[0, 1, 2, 3, 4].map((c) => (
              <span
                key={c}
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor:
                    c === 0
                      ? '#f1f5f9'
                      : c === 1
                      ? THEME.accent
                      : c === 2
                      ? THEME.primaryLight
                      : c === 3
                      ? THEME.primary
                      : THEME.primaryDark,
                }}
              />
            ))}
            <span>多</span>
          </div>
        </div>
        <StudyCalendar activityByDate={activityByDate} />
      </section>

      {/* ===== カテゴリ別正答率 ===== */}
      <section className="mb-4 rounded-lg bg-white border shadow-sm p-4" style={{ borderColor: THEME.accent }}>
        <h2 className="text-sm font-bold mb-3" style={{ color: THEME.primaryDark }}>
          カテゴリ別 クイズ正答率
        </h2>
        {categoryAccuracy.size === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            まだクイズ記録がありません。
            <Link to="/quiz" className="underline ml-1" style={{ color: THEME.primary }}>
              クイズを始める
            </Link>
          </p>
        ) : (
          <ul className="space-y-1.5">
            {NOTE_CATEGORIES.map((cat) => {
              const v = categoryAccuracy.get(cat.key)
              if (!v) return null
              const rate = v.total === 0 ? 0 : Math.round((v.correct / v.total) * 100)
              return (
                <li key={cat.key} className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 w-36 flex-shrink-0 truncate">
                    {cat.label}
                  </span>
                  <div className="flex-1 h-4 rounded bg-slate-100 overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${rate}%`,
                        backgroundColor:
                          rate >= 80
                            ? '#10b981'
                            : rate >= 60
                            ? THEME.primary
                            : rate >= 40
                            ? THEME.primaryLight
                            : '#ef4444',
                      }}
                    />
                  </div>
                  <span
                    className="text-xs font-semibold w-20 text-right"
                    style={{ color: THEME.primaryDark }}
                  >
                    {rate}% ({v.correct}/{v.total})
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* ===== 最近の活動 ===== */}
      <section className="mb-4 rounded-lg bg-white border shadow-sm p-4" style={{ borderColor: THEME.accent }}>
        <h2 className="text-sm font-bold mb-3" style={{ color: THEME.primaryDark }}>
          最近の活動
        </h2>
        {recentEvents.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            まだ活動がありません
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentEvents.map((e, i) => (
              <li key={i} className="py-2 flex items-start gap-2.5">
                <span
                  className="flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded text-white mt-0.5"
                  style={{
                    backgroundColor:
                      e.type === 'practice' ? THEME.primary : THEME.primaryLight,
                  }}
                >
                  {e.type === 'practice' ? '演習' : 'クイズ'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-700 truncate">{e.title}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {e.date} · {e.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ===== 問題別ベスト ===== */}
      <section className="mb-4 rounded-lg bg-white border shadow-sm overflow-hidden" style={{ borderColor: THEME.accent }}>
        <h2
          className="text-sm font-bold px-4 py-2.5 border-b"
          style={{ color: THEME.primaryDark, backgroundColor: THEME.bgSoft, borderColor: THEME.accent }}
        >
          問題別 学習状況
        </h2>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-slate-500 border-b border-slate-100">
              <th className="text-left px-3 py-1.5 font-semibold">年度</th>
              <th className="text-left px-3 py-1.5 font-semibold">問</th>
              <th className="text-left px-3 py-1.5 font-semibold hidden sm:table-cell">テーマ</th>
              <th className="text-center px-3 py-1.5 font-semibold w-16">回数</th>
              <th className="text-right px-3 py-1.5 font-semibold w-20">最高</th>
              <th className="text-right px-3 py-1.5 font-semibold w-24">最終</th>
            </tr>
          </thead>
          <tbody>
            {afternoon1Problems.map((p) => {
              const count = records.filter((r) => r.problemId === p.id).length
              const best = bestByProblem.get(p.id)
              const last = records
                .filter((r) => r.problemId === p.id)
                .sort((a, b) => (a.date < b.date ? 1 : -1))[0]
              return (
                <tr key={p.id} className="border-t border-slate-50 hover:bg-slate-50">
                  <td className="px-3 py-1.5 font-semibold" style={{ color: THEME.primary }}>
                    {p.year}
                  </td>
                  <td className="px-3 py-1.5">問{p.number}</td>
                  <td className="px-3 py-1.5 hidden sm:table-cell truncate max-w-[220px]">
                    {p.title}
                  </td>
                  <td className="px-3 py-1.5 text-center text-slate-500">
                    {count === 0 ? '—' : count}
                  </td>
                  <td className="px-3 py-1.5 text-right font-semibold" style={{ color: THEME.primaryDark }}>
                    {best ? `${best.score}` : '—'}
                  </td>
                  <td className="px-3 py-1.5 text-right text-slate-400">
                    {last ? last.date.slice(5) : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>

      {/* ===== 演習記録の詳細／削除 ===== */}
      <section className="mb-4 rounded-lg bg-white border shadow-sm overflow-hidden" style={{ borderColor: THEME.accent }}>
        <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ backgroundColor: THEME.bgSoft, borderColor: THEME.accent }}>
          <h2 className="text-sm font-bold" style={{ color: THEME.primaryDark }}>
            演習記録（{records.length} 件）
          </h2>
          <button
            onClick={handleClearQuiz}
            className="text-[10px] text-slate-400 hover:text-red-500 underline"
          >
            クイズ履歴をリセット
          </button>
        </div>
        {records.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            演習記録はまだありません
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recordsSorted
              .slice()
              .reverse()
              .map((r) => {
                const p = afternoon1Problems.find((x) => x.id === r.problemId)
                return (
                  <li key={r.id} className="px-4 py-2 flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 truncate">
                        {p ? `${p.year} 問${p.number}：${p.title}` : r.problemId}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {r.date}
                        {r.durationSec ? ` · ${fmtDuration(r.durationSec)}` : ''}
                        {r.memo ? ` · ${r.memo}` : ''}
                      </p>
                    </div>
                    <span
                      className="text-sm font-bold px-2 py-0.5 rounded text-white flex-shrink-0"
                      style={{
                        backgroundColor:
                          r.score >= 60 ? '#10b981' : THEME.primaryLight,
                      }}
                    >
                      {r.score}
                    </span>
                    <button
                      onClick={() => handleDeleteRecord(r.id)}
                      className="text-[10px] text-slate-400 hover:text-red-500 px-1"
                      aria-label="削除"
                    >
                      ✕
                    </button>
                  </li>
                )
              })}
          </ul>
        )}
      </section>

      <p className="text-[10px] text-slate-400">
        ※ 記録は全てブラウザの localStorage に保存されています。別端末とは同期されません。
      </p>
    </div>
  )
}

// ------------------------------------------------------------
// 小物：統計カード
// ------------------------------------------------------------
interface StatCardProps {
  label: string
  value: string
  sub?: string
  accent?: string
}

function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div
      className="rounded-lg bg-white border shadow-sm px-3 py-2.5"
      style={{ borderColor: THEME.accent }}
    >
      <p className="text-[10px] text-slate-500 font-semibold">{label}</p>
      <p className="text-xl font-black mt-0.5" style={{ color: accent ?? THEME.primaryDark }}>
        {value}
      </p>
      {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
    </div>
  )
}
