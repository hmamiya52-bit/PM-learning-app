import { Link } from 'react-router-dom'
import { NOTE_CATEGORIES } from '../data/noteCategories'
import { NOTE_DB } from '../data/noteContent'

const THEME = {
  primary: '#7B2D5F',
  primaryDark: '#4A1A38',
  primaryLight: '#A04080',
  accent: '#D4A5C0',
  bgSoft: '#FAF5F8',
}

// カテゴリごとのアクセントバリエーション（見た目の変化付け）
const CARD_COLORS: Array<{ bg: string; fg: string }> = [
  { bg: '#FAF5F8', fg: '#7B2D5F' }, // primary
  { bg: '#F0F6FF', fg: '#1d4ed8' }, // blue
  { bg: '#ECFDF5', fg: '#059669' }, // emerald
  { bg: '#FEF3C7', fg: '#B45309' }, // amber
  { bg: '#F3E8FF', fg: '#7e22ce' }, // purple
  { bg: '#FEE2E2', fg: '#b91c1c' }, // red
  { bg: '#E0F2FE', fg: '#0369a1' }, // sky
  { bg: '#FFE4E6', fg: '#be123c' }, // rose
  { bg: '#ECFEFF', fg: '#0e7490' }, // cyan
]

function IconBook() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  )
}

function IconArrowRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}

export default function Notes() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: THEME.bgSoft }}>
      <div className="max-w-4xl mx-auto px-4 pb-16 pt-5">
        {/* ===== ヘッダ ===== */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1" style={{ color: THEME.primary }}>
            <IconBook />
            <h1 className="text-xl sm:text-2xl font-black" style={{ color: THEME.primaryDark }}>
              ノートモード
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            PMBOK 10知識エリア＋横断トピックを1ページずつ確認。赤字は重要暗記ワード（「赤字を隠す」で暗記テスト）。
          </p>
        </div>

        {/* ===== カテゴリグリッド ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {NOTE_CATEGORIES.map((cat, idx) => {
            const color = CARD_COLORS[idx % CARD_COLORS.length]
            const note = NOTE_DB[cat.key]
            return (
              <Link
                key={cat.key}
                to={`/notes/${cat.key}`}
                className="group flex items-center gap-3 bg-white rounded-xl border px-4 py-3.5 hover:shadow-md transition-all focus:outline-none focus-visible:ring-2"
                style={{ borderColor: THEME.accent }}
                aria-label={`${cat.label}のノートを開く`}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: color.bg, color: color.fg }}
                >
                  <IconBook />
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-bold leading-snug truncate"
                    style={{ color: THEME.primaryDark }}
                  >
                    {cat.label}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                    {note?.summary ?? ''}
                  </p>
                </div>

                <div className="text-slate-300 group-hover:text-slate-500 flex-shrink-0">
                  <IconArrowRight />
                </div>
              </Link>
            )
          })}
        </div>

        <p className="mt-4 text-[10px] text-slate-400">
          {NOTE_CATEGORIES.length} カテゴリ
        </p>
      </div>
    </div>
  )
}
