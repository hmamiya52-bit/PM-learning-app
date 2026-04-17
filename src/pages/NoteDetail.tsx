import { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { NoteCategory } from '../types'
import { NOTE_CATEGORIES, getCategoryMeta } from '../data/noteCategories'
import { NOTE_DB } from '../data/noteContent'

const THEME = {
  primary: '#7B2D5F',
  primaryDark: '#4A1A38',
  primaryLight: '#A04080',
  accent: '#D4A5C0',
  bgSoft: '#FAF5F8',
  redMask: '#c0392b', // 赤字マスク色（NWSPと同色）
}

// ----------------------------------------------------------------
// 赤字ワードのトグル（NWSPロジック踏襲）
// ----------------------------------------------------------------
interface RedWordProps {
  text: string
  masked: boolean
  version: number
}

function RedWord({ text, masked, version }: RedWordProps) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (masked) setRevealed(false)
  }, [masked, version])

  if (!masked) {
    return <span className="text-red-600 font-bold">{text}</span>
  }
  if (revealed) {
    return (
      <span
        role="button"
        tabIndex={0}
        className="text-red-600 font-bold cursor-pointer underline decoration-dotted"
        title="クリックで再び隠す"
        onClick={() => setRevealed(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setRevealed(false)
          }
        }}
      >
        {text}
      </span>
    )
  }
  return (
    <span
      role="button"
      tabIndex={0}
      className="rounded px-0.5 cursor-pointer select-none"
      style={{ backgroundColor: THEME.redMask, color: 'transparent' }}
      title="クリックで表示"
      onClick={() => setRevealed(true)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setRevealed(true)
        }
      }}
    >
      {text}
    </span>
  )
}

// ==text== を RedWord に置換
function renderText(text: string, hideRed: boolean, version: number): React.ReactNode {
  const parts = text.split(/(==.+?==)/g)
  return parts.map((part, i) => {
    if (part.startsWith('==') && part.endsWith('==')) {
      const inner = part.slice(2, -2)
      return <RedWord key={i} text={inner} masked={hideRed} version={version} />
    }
    return <span key={i}>{part}</span>
  })
}

// ----------------------------------------------------------------
// NoteDetail
// ----------------------------------------------------------------
export default function NoteDetail() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const key = categoryId as NoteCategory | undefined
  const category = key ? NOTE_CATEGORIES.find((c) => c.key === key) : undefined
  const note = key ? NOTE_DB[key] : undefined

  const [hideRed, setHideRed] = useState(false)
  const [maskVersion, setMaskVersion] = useState(0)
  const [toastVisible, setToastVisible] = useState(false)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const toggleHide = () => {
    setHideRed((v) => {
      const next = !v
      if (next) {
        setMaskVersion((k) => k + 1) // ON時に全RedWordをリセット
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
        setToastVisible(true)
        toastTimerRef.current = setTimeout(() => setToastVisible(false), 3000)
      }
      return next
    })
  }

  // 前後ナビ
  const orderedKeys = NOTE_CATEGORIES.map((c) => c.key)
  const currentIdx = key ? orderedKeys.indexOf(key) : -1
  const prevKey = currentIdx > 0 ? orderedKeys[currentIdx - 1] : null
  const nextKey = currentIdx >= 0 && currentIdx < orderedKeys.length - 1 ? orderedKeys[currentIdx + 1] : null
  const prevCategory = prevKey ? getCategoryMeta(prevKey) : null
  const nextCategory = nextKey ? getCategoryMeta(nextKey) : null

  if (!category || !note) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <p className="text-slate-500 text-sm mb-3">ノートが見つかりません</p>
        <Link to="/notes" className="text-sm underline" style={{ color: THEME.primary }}>
          ← ノート一覧へ
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: THEME.bgSoft }}>
      <div className="max-w-3xl mx-auto px-4 pb-32 pt-5">
        {/* ===== パンくず ===== */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <Link to="/notes" className="hover:underline" style={{ color: THEME.primary }}>
            ノートモード
          </Link>
          <span>/</span>
          <span className="text-slate-700">{category.label}</span>
        </nav>

        {/* ===== ヘッダ ===== */}
        <div className="mb-5">
          <div
            className="inline-block text-xs font-semibold px-3 py-1 rounded-full text-white mb-2"
            style={{ backgroundColor: THEME.primaryDark }}
          >
            {category.label}
          </div>
          <h1 className="text-2xl font-black" style={{ color: THEME.primaryDark }}>
            {category.label} ノート
          </h1>
          <p className="mt-1 text-xs text-slate-500">{note.summary}</p>

          {/* 凡例 */}
          <div
            className="mt-3 flex items-center gap-3 text-xs text-slate-600 bg-white border rounded-lg px-3 py-2 flex-wrap"
            style={{ borderColor: THEME.accent }}
          >
            <span className="text-red-600 font-bold">赤字</span>
            <span>= 重要暗記ワード</span>
            <span className="mx-1 text-slate-300">|</span>
            {hideRed ? (
              <span className="flex items-center gap-1 flex-wrap">
                <span
                  className="inline-block w-10 rounded text-center text-xs"
                  style={{ backgroundColor: THEME.redMask, color: 'transparent' }}
                >
                  隠れ
                </span>
                <span>をタップで表示 / もう一度タップで再び隠す</span>
              </span>
            ) : (
              <span>画面下の「赤字を隠す」で暗記テストができます</span>
            )}
          </div>
        </div>

        {/* ===== Sections ===== */}
        <div className="space-y-4">
          {note.sections.map((section, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border shadow-sm overflow-hidden"
              style={{ borderColor: THEME.accent }}
            >
              <div
                className="px-4 py-2.5 border-b"
                style={{ backgroundColor: THEME.primary, borderColor: THEME.primaryDark }}
              >
                <h2 className="text-sm font-bold text-white leading-snug">{section.heading}</h2>
              </div>
              <ul className="px-4 py-3 space-y-2">
                {section.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2 text-sm text-slate-700 leading-relaxed"
                  >
                    <span
                      className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: THEME.primaryLight }}
                    />
                    <span>{renderText(item, hideRed, maskVersion)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ===== 試験で狙われるポイント ===== */}
        <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-amber-200 bg-amber-100">
            <h2 className="text-sm font-bold text-amber-800">★ 試験で狙われるポイント</h2>
          </div>
          <ul className="px-4 py-3 space-y-2">
            {note.exam_tips.map((tip, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-amber-900 leading-relaxed"
              >
                <span className="flex-shrink-0 mt-0.5 text-amber-500 font-bold">!</span>
                <span>{renderText(tip, hideRed, maskVersion)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ===== 前後ナビ ===== */}
        {(prevCategory || nextCategory) && (
          <div className="mt-5 flex gap-3">
            {prevCategory ? (
              <Link
                to={`/notes/${prevCategory.key}`}
                className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl border bg-white text-sm text-slate-600 hover:shadow transition-all min-w-0"
                style={{ borderColor: THEME.accent }}
              >
                <span className="flex-shrink-0">←</span>
                <span className="truncate">{prevCategory.label}</span>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
            {nextCategory ? (
              <Link
                to={`/notes/${nextCategory.key}`}
                className="flex-1 flex items-center justify-end gap-2 px-4 py-2.5 rounded-xl border bg-white text-sm text-slate-600 hover:shadow transition-all min-w-0"
                style={{ borderColor: THEME.accent }}
              >
                <span className="truncate">{nextCategory.label}</span>
                <span className="flex-shrink-0">→</span>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </div>
        )}

        {/* ===== 下部ナビ ===== */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <Link
            to="/notes"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border bg-white text-sm font-semibold text-slate-600 hover:shadow transition-all"
            style={{ borderColor: THEME.accent }}
          >
            ← ノート一覧へ
          </Link>
          <Link
            to={`/quiz?category=${category.key}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-colors"
            style={{ backgroundColor: THEME.primary }}
          >
            このカテゴリのクイズ →
          </Link>
        </div>
      </div>

      {/* ===== トースト ===== */}
      {toastVisible && (
        <div
          className="fixed bottom-16 left-1/2 -translate-x-1/2 z-40 bg-slate-800 text-white text-sm rounded-xl px-4 py-2.5 shadow-lg flex items-center gap-2 whitespace-nowrap"
          role="status"
          aria-live="polite"
        >
          <span>👆</span>
          <span>赤字をタップすると答えが表示されます</span>
        </div>
      )}

      {/* ===== スティッキーフッター：赤字を隠す ===== */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t shadow-lg z-30" style={{ borderColor: THEME.accent }}>
        <div className="max-w-3xl mx-auto px-4 py-2.5 flex justify-center sm:justify-end">
          <button
            onClick={toggleHide}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold border-2 transition-all shadow-sm ${
              hideRed
                ? 'bg-red-600 border-red-600 text-white shadow-red-200'
                : 'bg-white border-red-400 text-red-600 hover:bg-red-50'
            }`}
            aria-pressed={hideRed}
          >
            <span className="text-base">{hideRed ? '👁' : '📕'}</span>
            {hideRed ? '赤字を表示する' : '赤字を隠す'}
          </button>
        </div>
      </div>
    </div>
  )
}
