import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { afternoon2Problems, ESSAY_LIMITS } from '../data/afternoon2Problems'
import { loadDraft, upsertDraft, deleteDraft, countChars } from '../lib/afternoon2'
import { loadEpisodes, EPISODE_TAG_LABEL } from '../lib/episodes'
import type { EssaySection } from '../types'

const THEME = {
  primary: '#7B2D5F',
  primaryDark: '#4A1A38',
  primaryLight: '#A04080',
  accent: '#D4A5C0',
  bgSoft: '#FAF5F8',
}

type Tab = EssaySection | 'overview'

function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}

export default function Afternoon2Practice() {
  const { id } = useParams<{ id: string }>()
  const problem = useMemo(
    () => afternoon2Problems.find((p) => p.id === id),
    [id]
  )

  const [tab, setTab] = useState<Tab>('overview')
  const [sectionA, setSectionA] = useState('')
  const [sectionB, setSectionB] = useState('')
  const [sectionC, setSectionC] = useState('')
  const [elapsedSec, setElapsedSec] = useState(0)
  const [running, setRunning] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)

  const timerRef = useRef<number | null>(null)
  const saveTimerRef = useRef<number | null>(null)
  const initialLoadRef = useRef(false)

  const episodes = useMemo(() => loadEpisodes(), [])

  // 初回ロード
  useEffect(() => {
    if (!id) return
    const d = loadDraft(id)
    if (d) {
      setSectionA(d.sectionA)
      setSectionB(d.sectionB)
      setSectionC(d.sectionC)
      setElapsedSec(d.elapsedSec ?? 0)
      setLastSavedAt(d.updatedAt)
    }
    initialLoadRef.current = true
  }, [id])

  // タイマー
  useEffect(() => {
    if (!running) {
      if (timerRef.current) window.clearInterval(timerRef.current)
      timerRef.current = null
      return
    }
    timerRef.current = window.setInterval(() => {
      setElapsedSec((s) => s + 1)
    }, 1000)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [running])

  // 自動保存（デバウンス 800ms）
  useEffect(() => {
    if (!id || !initialLoadRef.current) return
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current)
    saveTimerRef.current = window.setTimeout(() => {
      const d = upsertDraft(id, { sectionA, sectionB, sectionC, elapsedSec })
      setLastSavedAt(d.updatedAt)
    }, 800)
    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current)
    }
  }, [id, sectionA, sectionB, sectionC, elapsedSec])

  if (!problem) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <p className="text-sm text-slate-500">問題が見つかりません。</p>
        <Link to="/afternoon2" className="text-sm underline" style={{ color: THEME.primary }}>
          一覧へ戻る
        </Link>
      </div>
    )
  }

  const aChars = countChars(sectionA)
  const bChars = countChars(sectionB)
  const cChars = countChars(sectionC)
  const totalChars = aChars + bChars + cChars

  const handleSaveNow = () => {
    if (!id) return
    const d = upsertDraft(id, { sectionA, sectionB, sectionC, elapsedSec })
    setLastSavedAt(d.updatedAt)
    setShowToast(true)
    window.setTimeout(() => setShowToast(false), 2000)
  }

  const handleReset = () => {
    if (!id) return
    if (!confirm('ドラフトとタイマーをリセットします。本当によろしいですか？')) return
    deleteDraft(id)
    setSectionA('')
    setSectionB('')
    setSectionC('')
    setElapsedSec(0)
    setRunning(false)
    setLastSavedAt(null)
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: THEME.bgSoft }}>
      <div className="max-w-5xl mx-auto px-4 py-5">
        {/* ===== ヘッダ ===== */}
        <header className="mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link to="/afternoon2" className="hover:underline" style={{ color: THEME.primary }}>
              ← 午後II 一覧
            </Link>
            <span>/</span>
            <span>{problem.yearLabel}</span>
            <span>·</span>
            <span>問{problem.number}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold" style={{ color: THEME.primaryDark }}>
            {problem.title}
          </h1>
          <p className="text-xs text-slate-600 mt-1">{problem.theme}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {problem.keywords.map((k) => (
              <span
                key={k}
                className="text-[10px] px-1.5 py-0.5 rounded"
                style={{
                  color: THEME.primary,
                  backgroundColor: '#ffffff',
                  border: `1px solid ${THEME.accent}`,
                }}
              >
                {k}
              </span>
            ))}
          </div>
        </header>

        {/* ===== ステータスバー（タイマー + 字数） ===== */}
        <section
          className="rounded-lg bg-white border shadow-sm px-4 py-3 mb-4 flex flex-wrap items-center gap-4"
          style={{ borderColor: THEME.accent }}
        >
          {/* タイマー */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-wider text-slate-500">TIMER</span>
            <span
              className="font-mono text-2xl font-bold tabular-nums"
              style={{ color: running ? THEME.primary : THEME.primaryDark }}
            >
              {formatDuration(elapsedSec)}
            </span>
            <button
              onClick={() => setRunning((r) => !r)}
              className="text-xs font-bold px-3 py-1 rounded text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: running ? '#ef4444' : THEME.primary }}
            >
              {running ? '停止' : elapsedSec > 0 ? '再開' : '開始'}
            </button>
            <span className="text-[10px] text-slate-400">制限 120:00</span>
          </div>

          {/* 字数 */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[10px] font-bold tracking-wider text-slate-500">TOTAL</span>
            <span
              className="font-mono text-lg font-bold"
              style={{ color: totalChars >= 2200 ? '#10b981' : THEME.primaryDark }}
            >
              {totalChars.toLocaleString()}
              <span className="text-xs text-slate-400"> / 2,200字</span>
            </span>
          </div>

          {/* 保存 */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveNow}
              className="text-xs font-semibold px-3 py-1 rounded border hover:bg-slate-50 transition-colors"
              style={{ color: THEME.primary, borderColor: THEME.accent }}
            >
              保存
            </button>
            <button
              onClick={handleReset}
              className="text-xs font-semibold px-3 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
            >
              リセット
            </button>
          </div>

          {lastSavedAt && (
            <span className="text-[10px] text-slate-400 w-full sm:w-auto">
              最終保存: {new Date(lastSavedAt).toLocaleString('ja-JP')}
            </span>
          )}
        </section>

        {/* ===== タブ ===== */}
        <div className="flex gap-1 mb-3 overflow-x-auto">
          {(['overview', 'a', 'b', 'c'] as Tab[]).map((t) => {
            const label =
              t === 'overview' ? '📋 設問全文'
                : t === 'a' ? '設問ア'
                  : t === 'b' ? '設問イ'
                    : '設問ウ'
            const chars = t === 'a' ? aChars : t === 'b' ? bChars : t === 'c' ? cChars : null
            const active = tab === t
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="text-xs font-semibold px-3 py-2 rounded-t transition-colors whitespace-nowrap"
                style={{
                  backgroundColor: active ? '#ffffff' : 'transparent',
                  color: active ? THEME.primary : '#64748b',
                  borderBottom: active ? `2px solid ${THEME.primary}` : '2px solid transparent',
                }}
              >
                {label}
                {chars !== null && (
                  <span className="ml-1.5 text-[10px] font-mono text-slate-400">
                    {chars}字
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* ===== タブ内容 ===== */}
        {tab === 'overview' ? (
          <OverviewPanel problem={problem} />
        ) : (
          <EditorPanel
            section={tab}
            prompt={
              tab === 'a' ? problem.promptA : tab === 'b' ? problem.promptB : problem.promptC
            }
            limits={ESSAY_LIMITS[tab]}
            value={tab === 'a' ? sectionA : tab === 'b' ? sectionB : sectionC}
            onChange={(v) => {
              if (tab === 'a') setSectionA(v)
              else if (tab === 'b') setSectionB(v)
              else setSectionC(v)
            }}
            episodes={episodes}
          />
        )}
      </div>

      {/* ===== トースト ===== */}
      {showToast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-white text-sm font-semibold"
          style={{ backgroundColor: THEME.primary }}
        >
          ✓ 保存しました
        </div>
      )}
    </div>
  )
}

// ------------------------------------------------------------
// 設問全文 panel
// ------------------------------------------------------------
function OverviewPanel({ problem }: { problem: typeof afternoon2Problems[number] }) {
  const items: Array<{
    label: string
    text: string
    limits: { min: number; max: number; recommended: number; label: string }
  }> = [
    { label: '設問ア', text: problem.promptA, limits: ESSAY_LIMITS.a },
    { label: '設問イ', text: problem.promptB, limits: ESSAY_LIMITS.b },
    { label: '設問ウ', text: problem.promptC, limits: ESSAY_LIMITS.c },
  ]
  return (
    <div className="space-y-3">
      {items.map((it) => (
        <div key={it.label} className="rounded-lg bg-white border border-slate-200 shadow-sm p-4">
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="text-sm font-bold" style={{ color: THEME.primary }}>
              {it.label}
            </h2>
            <span className="text-[10px] text-slate-500 font-mono">
              {it.limits.min > 0 && `${it.limits.min}〜`}{it.limits.max}字
            </span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {it.text}
          </p>
        </div>
      ))}
      {problem.questionPdfUrl && (
        <a
          href={problem.questionPdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold"
          style={{ color: THEME.primary }}
        >
          📄 IPA公式 問題PDF を開く →
        </a>
      )}
    </div>
  )
}

// ------------------------------------------------------------
// Editor panel
// ------------------------------------------------------------
function EditorPanel({
  section,
  prompt,
  limits,
  value,
  onChange,
  episodes,
}: {
  section: EssaySection
  prompt: string
  limits: { min: number; max: number; recommended: number; label: string }
  value: string
  onChange: (v: string) => void
  episodes: ReturnType<typeof loadEpisodes>
}) {
  const chars = countChars(value)
  const pct = Math.min(100, (chars / limits.max) * 100)
  const status: 'under' | 'ok' | 'over' =
    chars < limits.min ? 'under' : chars > limits.max ? 'over' : 'ok'
  const barColor = status === 'over' ? '#ef4444' : status === 'ok' ? '#10b981' : THEME.primaryLight

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
      {/* Main editor */}
      <div className="rounded-lg bg-white border border-slate-200 shadow-sm p-4">
        <div className="mb-3">
          <h2 className="text-sm font-bold mb-1" style={{ color: THEME.primary }}>
            {limits.label}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
            {prompt}
          </p>
        </div>

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`ここに${section === 'a' ? '設問ア' : section === 'b' ? '設問イ' : '設問ウ'}の本文を入力...`}
          className="w-full min-h-[420px] p-3 rounded border border-slate-200 text-sm leading-relaxed resize-y focus:outline-none focus:ring-2"
          style={{
            fontFamily: '"Meiryo UI", Meiryo, sans-serif',
            outlineColor: THEME.primary,
          }}
        />

        {/* Progress */}
        <div className="mt-3">
          <div className="flex items-baseline justify-between text-xs mb-1">
            <span className="text-slate-500">
              字数: <span className="font-mono font-bold" style={{ color: THEME.primaryDark }}>{chars}</span>
              {limits.min > 0 && <span className="text-slate-400"> / 下限 {limits.min}</span>}
              <span className="text-slate-400"> / 上限 {limits.max}</span>
            </span>
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
              style={{ backgroundColor: barColor }}
            >
              {status === 'under' ? '不足' : status === 'over' ? '超過' : 'OK'}
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full transition-all"
              style={{ width: `${pct}%`, backgroundColor: barColor }}
            />
          </div>
        </div>
      </div>

      {/* Sidebar: episode reference */}
      <aside className="rounded-lg bg-white border border-slate-200 shadow-sm p-3 h-fit lg:sticky lg:top-16">
        <h3 className="text-xs font-bold mb-2" style={{ color: THEME.primaryDark }}>
          💡 ネタ帳（参照用）
        </h3>
        {episodes.length === 0 ? (
          <p className="text-[11px] text-slate-500 leading-relaxed">
            ネタ帳にエピソードが登録されていません。
            <br />
            <Link to="/episodes" className="underline" style={{ color: THEME.primary }}>
              ネタ帳で登録
            </Link>
          </p>
        ) : (
          <ul className="space-y-2 max-h-[460px] overflow-y-auto">
            {episodes.map((ep) => (
              <li
                key={ep.id}
                className="border border-slate-200 rounded p-2 text-[11px]"
              >
                <p className="font-semibold text-slate-800 leading-tight">{ep.title}</p>
                <p className="text-slate-500 mt-0.5 line-clamp-2">{ep.projectOverview}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {ep.tags.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="text-[9px] px-1 py-0.5 rounded"
                      style={{
                        color: THEME.primary,
                        backgroundColor: THEME.bgSoft,
                      }}
                    >
                      {EPISODE_TAG_LABEL[t]}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
        <Link
          to="/episodes"
          className="block text-center text-[11px] font-semibold mt-3 px-2 py-1 rounded border hover:bg-slate-50 transition-colors"
          style={{ color: THEME.primary, borderColor: THEME.accent }}
        >
          ネタ帳を開く →
        </Link>
      </aside>
    </div>
  )
}
