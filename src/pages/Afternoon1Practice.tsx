import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { afternoon1Problems } from '../data/afternoon1Problems'
import { findAnswer } from '../data/afternoon1Answers'
import { addRecord, loadMyAnswer, saveMyAnswer, getMaxScore } from '../lib/tracker'
import type { Afternoon1AnswerRow } from '../types'

const THEME = {
  primary: '#7B2D5F',
  primaryDark: '#4A1A38',
  primaryLight: '#A04080',
  accent: '#D4A5C0',
  bgSoft: '#FAF5F8',
}

type Mark = '' | 'correct' | 'partial' | 'wrong'

function rowKey(row: Afternoon1AnswerRow, idx: number): string {
  return `${row.s}_${row.q ?? ''}_${row.t ?? ''}_${idx}`
}

function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function Afternoon1Practice() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const problem = afternoon1Problems.find((p) => p.id === id)
  const answerSet = id ? findAnswer(id) : undefined

  // Timer
  const [durationSec, setDurationSec] = useState(0)
  const [running, setRunning] = useState(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (running) {
      timerRef.current = window.setInterval(() => {
        setDurationSec((s) => s + 1)
      }, 1000)
    } else if (timerRef.current !== null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [running])

  // 自分の解答（下書き）
  const [myAnswers, setMyAnswers] = useState<Record<string, string>>({})
  const [marks, setMarks] = useState<Record<string, Mark>>({})
  const [checkMode, setCheckMode] = useState(false)

  useEffect(() => {
    if (!id) return
    setMyAnswers(loadMyAnswer(id))
  }, [id])

  // 自動保存
  useEffect(() => {
    if (!id) return
    const handle = window.setTimeout(() => {
      saveMyAnswer(id, myAnswers)
    }, 500)
    return () => window.clearTimeout(handle)
  }, [id, myAnswers])

  const rows = answerSet?.answers ?? []

  // スコア算出
  const scoreInfo = useMemo(() => {
    if (rows.length === 0) return { earned: 0, total: 0, estimated: 0 }
    const totalRows = rows.length
    let earned = 0
    rows.forEach((row, idx) => {
      const key = rowKey(row, idx)
      const m = marks[key]
      if (m === 'correct') earned += 1
      else if (m === 'partial') earned += 0.5
    })
    const estimated = Math.round((earned / totalRows) * getMaxScore())
    return { earned, total: totalRows, estimated }
  }, [rows, marks])

  if (!problem) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-5">
        <p className="text-slate-500">問題が見つかりません。</p>
        <Link to="/afternoon1" className="text-sm underline" style={{ color: THEME.primary }}>
          問題一覧に戻る
        </Link>
      </div>
    )
  }

  const handleMark = (key: string, mark: Mark) => {
    setMarks((prev) => ({ ...prev, [key]: prev[key] === mark ? '' : mark }))
  }

  const handleAnswerChange = (key: string, value: string) => {
    setMyAnswers((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveScore = () => {
    if (!answerSet) return
    const today = new Date().toISOString().slice(0, 10)
    addRecord({
      problemId: problem.id,
      date: today,
      score: scoreInfo.estimated,
      durationSec,
      memo: `${formatDuration(durationSec)} / 自己採点 ${scoreInfo.earned.toFixed(1)}問 正解相当`,
    })
    alert(`記録しました（推定 ${scoreInfo.estimated} 点）`)
    navigate('/afternoon1')
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-5">
      {/* ===== パンくず ===== */}
      <div className="mb-2">
        <Link
          to="/afternoon1"
          className="text-xs hover:underline"
          style={{ color: THEME.primary }}
        >
          ← 問題一覧に戻る
        </Link>
      </div>

      {/* ===== ヘッダ ===== */}
      <header
        className="mb-4 rounded-lg p-4 text-white shadow-md"
        style={{
          background: `linear-gradient(135deg, ${THEME.primaryDark} 0%, ${THEME.primary} 100%)`,
        }}
      >
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-wider opacity-80">
                {problem.year} 午後I
              </span>
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/20"
              >
                問{problem.number}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black leading-tight">
              {problem.title}
            </h1>
            <div className="flex flex-wrap gap-1 mt-2">
              {problem.keywords.map((k) => (
                <span
                  key={k}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-white/20"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
          {problem.questionPdfUrl && (
            <a
              href={problem.questionPdfUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold px-3 py-1.5 rounded bg-white/20 hover:bg-white/30 transition-colors whitespace-nowrap"
            >
              問題PDF ↗
            </a>
          )}
        </div>
      </header>

      {/* ===== タイマー + コントロール ===== */}
      <section className="mb-4 rounded-lg bg-white border border-slate-200 px-4 py-3 shadow-sm flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">経過時間:</span>
          <span
            className="text-xl font-mono font-bold tabular-nums"
            style={{ color: THEME.primaryDark }}
          >
            {formatDuration(durationSec)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {!running ? (
            <button
              onClick={() => setRunning(true)}
              className="text-xs font-semibold px-3 py-1 rounded text-white hover:opacity-90"
              style={{ backgroundColor: THEME.primary }}
            >
              開始
            </button>
          ) : (
            <button
              onClick={() => setRunning(false)}
              className="text-xs font-semibold px-3 py-1 rounded border hover:bg-slate-50"
              style={{ color: THEME.primary, borderColor: THEME.accent }}
            >
              一時停止
            </button>
          )}
          <button
            onClick={() => {
              setRunning(false)
              setDurationSec(0)
            }}
            className="text-xs font-medium px-3 py-1 rounded text-slate-500 hover:bg-slate-100"
          >
            リセット
          </button>
        </div>

        <div className="flex-1" />

        <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
          <input
            type="checkbox"
            checked={checkMode}
            onChange={(e) => setCheckMode(e.target.checked)}
            style={{ accentColor: THEME.primary }}
          />
          <span style={{ color: THEME.primary }}>答え合わせモード</span>
        </label>
      </section>

      {/* ===== 解答入力エリア ===== */}
      {rows.length === 0 ? (
        <section className="rounded-lg bg-white border border-slate-200 px-4 py-6 shadow-sm text-center">
          <p className="text-sm text-slate-500 mb-2">
            この問題の模範解答データはまだ登録されていません。
          </p>
          <p className="text-xs text-slate-400">
            <code className="bg-slate-100 px-1 rounded">src/data/afternoon1Answers.ts</code>
            {' '}に追加すると、この画面で解答入力・自己採点ができるようになります。
          </p>
        </section>
      ) : (
        <>
          <section className="mb-4 rounded-lg bg-white border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs" style={{ backgroundColor: THEME.bgSoft, color: THEME.primaryDark }}>
                  <th className="text-left px-2 py-2 font-semibold w-12">設問</th>
                  <th className="text-left px-2 py-2 font-semibold w-14">小問</th>
                  <th className="text-left px-2 py-2 font-semibold w-20">ラベル</th>
                  <th className="text-left px-2 py-2 font-semibold">あなたの解答</th>
                  {checkMode && (
                    <th className="text-left px-2 py-2 font-semibold">模範解答（IPA）</th>
                  )}
                  <th className="text-center px-2 py-2 font-semibold w-28">自己採点</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => {
                  const key = rowKey(row, idx)
                  const mark = marks[key] ?? ''
                  return (
                    <tr key={key} className="border-t border-slate-100 align-top">
                      <td className="px-2 py-2 font-semibold text-slate-600">{row.s}</td>
                      <td className="px-2 py-2 text-slate-600">{row.q ?? ''}</td>
                      <td className="px-2 py-2 text-slate-600">{row.t ?? ''}</td>
                      <td className="px-2 py-2">
                        {row.essay ? (
                          <textarea
                            value={myAnswers[key] ?? ''}
                            onChange={(e) => handleAnswerChange(key, e.target.value)}
                            placeholder="記述解答"
                            rows={2}
                            className="w-full text-xs border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2"
                            style={{ outlineColor: THEME.primary }}
                          />
                        ) : (
                          <input
                            type="text"
                            value={myAnswers[key] ?? ''}
                            onChange={(e) => handleAnswerChange(key, e.target.value)}
                            placeholder="解答"
                            className="w-full text-xs border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2"
                            style={{ outlineColor: THEME.primary }}
                          />
                        )}
                        {row.essay && (
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {(myAnswers[key] ?? '').length} 字
                          </p>
                        )}
                      </td>
                      {checkMode && (
                        <td
                          className="px-2 py-2 text-xs leading-relaxed"
                          style={{ backgroundColor: THEME.bgSoft, color: THEME.primaryDark }}
                        >
                          {row.a}
                        </td>
                      )}
                      <td className="px-2 py-2 text-center">
                        <div className="inline-flex gap-0.5">
                          {(['correct', 'partial', 'wrong'] as Mark[]).map((m) => {
                            const label = m === 'correct' ? '○' : m === 'partial' ? '△' : '×'
                            const color =
                              m === 'correct'
                                ? '#10b981'
                                : m === 'partial'
                                  ? '#f59e0b'
                                  : '#ef4444'
                            const isActive = mark === m
                            return (
                              <button
                                key={m}
                                onClick={() => handleMark(key, m)}
                                className="w-7 h-7 rounded text-sm font-bold transition-colors"
                                style={{
                                  backgroundColor: isActive ? color : '#f1f5f9',
                                  color: isActive ? 'white' : '#64748b',
                                }}
                                aria-label={label}
                                aria-pressed={isActive}
                              >
                                {label}
                              </button>
                            )
                          })}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </section>

          {/* ===== スコア集計 ===== */}
          <section
            className="rounded-lg p-4 shadow-sm border flex flex-wrap items-center gap-4"
            style={{ backgroundColor: '#ffffff', borderColor: THEME.accent }}
          >
            <div>
              <p className="text-[11px] text-slate-500">採点状況</p>
              <p className="text-sm font-semibold" style={{ color: THEME.primaryDark }}>
                {scoreInfo.earned.toFixed(1)} / {scoreInfo.total} 行
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500">推定スコア（100点満点）</p>
              <p className="text-2xl font-black" style={{ color: THEME.primary }}>
                {scoreInfo.estimated} <span className="text-sm font-normal text-slate-500">点</span>
              </p>
            </div>
            <div className="flex-1" />
            <button
              onClick={handleSaveScore}
              disabled={scoreInfo.total === 0}
              className="text-sm font-semibold px-4 py-2 rounded text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: THEME.primary }}
            >
              スコアを記録する
            </button>
          </section>
        </>
      )}
    </div>
  )
}
