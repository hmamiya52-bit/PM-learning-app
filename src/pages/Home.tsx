import { Link } from 'react-router-dom'
import { VERSION_LABEL } from '../version'

// ------------------------------------------------------------
// Theme colors (濃い赤紫)
// ------------------------------------------------------------
const THEME = {
  primary: '#7B2D5F',      // メインの濃い赤紫
  primaryDark: '#4A1A38',  // さらに暗い（サイドバー/ヘッダ用）
  primaryLight: '#A04080', // 明るめ（アクセント）
  accent: '#D4A5C0',       // 薄い赤紫（背景）
  bgSoft: '#FAF5F8',       // 非常に薄いピンク背景
}

// ------------------------------------------------------------
// Icons (inline SVG)
// ------------------------------------------------------------
function IconFileText({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className ?? 'w-5 h-5'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}
function IconEdit({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className ?? 'w-5 h-5'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  )
}
function IconBook({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className ?? 'w-5 h-5'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  )
}
function IconQuestion({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className ?? 'w-5 h-5'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093V14m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
function IconChart({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className ?? 'w-5 h-5'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}
function IconLightbulb({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className ?? 'w-5 h-5'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  )
}
function IconTarget({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className ?? 'w-5 h-5'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

// ------------------------------------------------------------
// Feature cards data
// ------------------------------------------------------------
interface Feature {
  phase: string
  title: string
  description: string
  icon: (cls: string) => React.ReactNode
  status: 'available' | 'coming-next' | 'planned' | 'done'
  to?: string
}

const FEATURES: Feature[] = [
  {
    phase: 'Phase 1',
    title: '午後I 演習',
    description: '過去5年分の午後I問題をタイマー付きで演習。模範解答と比較し自己採点',
    icon: (cls) => <IconFileText className={cls} />,
    status: 'done',
    to: '/afternoon1',
  },
  {
    phase: 'Phase 2',
    title: 'ノート（知識整理）',
    description: 'スコープ・リスク・品質管理などPMBOK知識をカテゴリ別に整理',
    icon: (cls) => <IconBook className={cls} />,
    status: 'done',
    to: '/notes',
  },
  {
    phase: 'Phase 2',
    title: 'クイズ',
    description: 'PM用語・フレームワークの択一クイズで知識を定着',
    icon: (cls) => <IconQuestion className={cls} />,
    status: 'done',
    to: '/quiz',
  },
  {
    phase: 'Phase 3',
    title: '進捗トラッカー',
    description: 'スコア履歴・学習計画を一元管理し成績推移を可視化',
    icon: (cls) => <IconChart className={cls} />,
    status: 'done',
    to: '/tracker',
  },
  {
    phase: 'Phase 4',
    title: '午後II 論述トレーニング',
    description: '設問ア・イ・ウの文字数カウント/タイマーで論文を練習',
    icon: (cls) => <IconEdit className={cls} />,
    status: 'available',
    to: '/afternoon2',
  },
  {
    phase: 'Phase 4',
    title: 'ネタ帳（エピソード管理）',
    description: '自分のプロジェクト経験を登録。テーマに使える経験ストックを蓄積',
    icon: (cls) => <IconLightbulb className={cls} />,
    status: 'available',
    to: '/episodes',
  },
]

// ------------------------------------------------------------
// Home
// ------------------------------------------------------------
export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: THEME.bgSoft }}>
      {/* ===== Hero (compact) ===== */}
      <header
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${THEME.primaryDark} 0%, ${THEME.primary} 60%, ${THEME.primaryLight} 100%)`,
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-15"
          style={{ backgroundColor: '#ffffff' }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full opacity-10"
          style={{ backgroundColor: '#ffffff' }}
          aria-hidden="true"
        />

        <div className="relative max-w-5xl mx-auto px-6 py-5 sm:py-6 text-white">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              {/* Logo badge */}
              <div className="inline-flex items-center gap-1.5 mb-1.5 px-2 py-0.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm">
                <IconTarget className="w-3 h-3 text-white" />
                <span className="text-[10px] font-semibold tracking-wider">
                  PM PROJECT MANAGER LEARNING APP
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight">
                プロジェクトマネージャ<span style={{ color: THEME.accent }}>への道</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-white/85 leading-snug mt-1">
                PM試験（午後I・午後II）の合格に直結する実践型学習アプリ
              </p>
            </div>

            {/* Version (right aligned on desktop) */}
            <p className="text-[10px] text-white/70 font-mono whitespace-nowrap">
              by MAMIYA · {VERSION_LABEL}
            </p>
          </div>
        </div>
      </header>

      {/* ===== Main ===== */}
      <main className="max-w-5xl mx-auto px-6 py-5 sm:py-6 space-y-5">
        {/* ===== アプリ紹介 (1行コンパクト) ===== */}
        <section aria-labelledby="intro-heading">
          <div
            className="rounded-lg px-4 py-2.5 border flex items-start gap-3"
            style={{ backgroundColor: '#ffffff', borderColor: THEME.accent }}
          >
            <span
              className="flex-shrink-0 text-[10px] font-bold tracking-widest px-1.5 py-0.5 rounded mt-0.5"
              style={{
                color: '#ffffff',
                backgroundColor: THEME.primary,
              }}
            >
              ABOUT
            </span>
            <p
              id="intro-heading"
              className="text-xs sm:text-sm text-slate-700 leading-relaxed"
            >
              IPA「プロジェクトマネージャ試験」の
              <strong style={{ color: THEME.primary }}>午後問題演習</strong>
              に特化。午後Iの記述対策と午後IIの論述対策を別アプローチで鍛え、知識整理用のノート・クイズも収録。過去問は
              <strong style={{ color: THEME.primary }}>直近5年分（R3〜R7）</strong>
              を予定。
            </p>
          </div>
        </section>

        {/* ===== Feature Roadmap (コンパクトな行レイアウト) ===== */}
        <section aria-labelledby="features-heading">
          <div className="flex items-baseline justify-between mb-2.5">
            <h2
              id="features-heading"
              className="text-base sm:text-lg font-bold"
              style={{ color: THEME.primaryDark }}
            >
              実装ロードマップ
            </h2>
            <span className="text-[11px] text-slate-500">
              現在: <strong style={{ color: THEME.primary }}>Phase 4</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {FEATURES.map((f) => {
              const content = (
                <>
                  {/* Icon (small, left) */}
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: THEME.bgSoft, color: THEME.primary }}
                  >
                    {f.icon('w-4 h-4')}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                      <span
                        className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded"
                        style={{
                          color: THEME.primary,
                          backgroundColor: THEME.bgSoft,
                        }}
                      >
                        {f.phase.toUpperCase()}
                      </span>
                      {f.status === 'available' && (
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded text-white"
                          style={{ backgroundColor: '#10b981' }}
                        >
                          NOW
                        </span>
                      )}
                      {f.status === 'done' && (
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded text-white"
                          style={{ backgroundColor: THEME.primaryLight }}
                        >
                          DONE
                        </span>
                      )}
                      {f.status === 'coming-next' && (
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded text-white"
                          style={{ backgroundColor: THEME.primary }}
                        >
                          NEXT
                        </span>
                      )}
                      <h3
                        className="text-sm font-bold leading-tight truncate"
                        style={{ color: THEME.primaryDark }}
                      >
                        {f.title}
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      {f.description}
                    </p>
                  </div>
                </>
              )
              const base = 'relative rounded-lg border px-3 py-2 shadow-sm flex items-start gap-2.5 transition-all'
              if (f.to) {
                return (
                  <Link
                    key={f.title}
                    to={f.to}
                    className={`${base} bg-white border-slate-200 hover:shadow-md hover:-translate-y-0.5`}
                    style={{ borderColor: THEME.accent }}
                  >
                    {content}
                  </Link>
                )
              }
              return (
                <article
                  key={f.title}
                  className={`${base} bg-white border-slate-200`}
                >
                  {content}
                </article>
              )
            })}
          </div>
        </section>

        {/* ===== Exam Info ===== */}
        <section aria-labelledby="exam-info-heading">
          <h2
            id="exam-info-heading"
            className="text-base sm:text-lg font-bold mb-2.5"
            style={{ color: THEME.primaryDark }}
          >
            PM試験 午後の構成
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* 午後I */}
            <div
              className="rounded-lg p-4 text-white shadow-md"
              style={{
                background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryLight} 100%)`,
              }}
            >
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="text-lg font-black">午後I（記述式）</h3>
                <span className="text-[10px] font-bold tracking-wider opacity-70">AFTERNOON I</span>
              </div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div className="flex justify-between border-b border-white/20 pb-0.5">
                  <dt className="opacity-80">形式</dt>
                  <dd className="font-semibold">記述式</dd>
                </div>
                <div className="flex justify-between border-b border-white/20 pb-0.5">
                  <dt className="opacity-80">問題</dt>
                  <dd className="font-semibold">3問中2問</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="opacity-80">時間</dt>
                  <dd className="font-semibold">90分</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="opacity-80">合格</dt>
                  <dd className="font-semibold">60点以上</dd>
                </div>
              </dl>
            </div>

            {/* 午後II */}
            <div
              className="rounded-lg p-4 text-white shadow-md"
              style={{
                background: `linear-gradient(135deg, ${THEME.primaryDark} 0%, ${THEME.primary} 100%)`,
              }}
            >
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="text-lg font-black">午後II（論述式）</h3>
                <span className="text-[10px] font-bold tracking-wider opacity-70">AFTERNOON II</span>
              </div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div className="flex justify-between border-b border-white/20 pb-0.5">
                  <dt className="opacity-80">形式</dt>
                  <dd className="font-semibold">論述（小論文）</dd>
                </div>
                <div className="flex justify-between border-b border-white/20 pb-0.5">
                  <dt className="opacity-80">問題</dt>
                  <dd className="font-semibold">2問中1問</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="opacity-80">時間</dt>
                  <dd className="font-semibold">120分</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="opacity-80">文字数</dt>
                  <dd className="font-semibold">2,200字以上</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* ===== Footer ===== */}
        <footer className="pt-3 pb-4 text-center">
          <p className="text-[10px] text-slate-400">
            © MAMIYA · PM Project Manager Learning App
          </p>
        </footer>
      </main>
    </div>
  )
}
