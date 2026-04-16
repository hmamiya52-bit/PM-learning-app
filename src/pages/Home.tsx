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
    <svg xmlns="http://www.w3.org/2000/svg" className={className ?? 'w-6 h-6'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}
function IconEdit({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className ?? 'w-6 h-6'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  )
}
function IconBook({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className ?? 'w-6 h-6'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  )
}
function IconQuestion({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className ?? 'w-6 h-6'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093V14m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
function IconChart({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className ?? 'w-6 h-6'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}
function IconLightbulb({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className ?? 'w-6 h-6'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  )
}
function IconTarget({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className ?? 'w-6 h-6'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
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
  status: 'coming-next' | 'planned'
}

const FEATURES: Feature[] = [
  {
    phase: 'Phase 1',
    title: '午後I 演習',
    description: '過去5年分（R3-R7）の午後I問題をタイマー付きで演習。模範解答と比較して自己採点',
    icon: (cls) => <IconFileText className={cls} />,
    status: 'coming-next',
  },
  {
    phase: 'Phase 2',
    title: 'ノート（知識整理）',
    description: 'スコープ管理・リスク管理・品質管理などPMBOK知識をカテゴリ別に整理',
    icon: (cls) => <IconBook className={cls} />,
    status: 'planned',
  },
  {
    phase: 'Phase 2',
    title: 'クイズ',
    description: 'PM用語・フレームワークの択一クイズで知識を定着',
    icon: (cls) => <IconQuestion className={cls} />,
    status: 'planned',
  },
  {
    phase: 'Phase 3',
    title: '進捗トラッカー',
    description: 'スコア履歴・学習計画を一元管理。午後I/IIの成績推移を可視化',
    icon: (cls) => <IconChart className={cls} />,
    status: 'planned',
  },
  {
    phase: 'Phase 4',
    title: '午後II 論述トレーニング',
    description: '設問ア・イ・ウの文字数カウント/タイマー。論文執筆を段階的に練習',
    icon: (cls) => <IconEdit className={cls} />,
    status: 'planned',
  },
  {
    phase: 'Phase 4',
    title: 'ネタ帳（エピソード管理）',
    description: '自分のプロジェクト経験を登録。どのテーマにも使える経験ストックを蓄積',
    icon: (cls) => <IconLightbulb className={cls} />,
    status: 'planned',
  },
]

// ------------------------------------------------------------
// Home
// ------------------------------------------------------------
export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: THEME.bgSoft }}>
      {/* ===== Hero ===== */}
      <header
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${THEME.primaryDark} 0%, ${THEME.primary} 60%, ${THEME.primaryLight} 100%)`,
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20"
          style={{ backgroundColor: '#ffffff' }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full opacity-10"
          style={{ backgroundColor: '#ffffff' }}
          aria-hidden="true"
        />

        <div className="relative max-w-5xl mx-auto px-6 py-16 sm:py-24 text-white">
          {/* Logo badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm">
            <IconTarget className="w-4 h-4 text-white" />
            <span className="text-xs font-semibold tracking-wider">
              PM PROJECT MANAGER LEARNING APP
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-4">
            プロジェクトマネージャ
            <br />
            <span style={{ color: THEME.accent }}>への道</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-2xl mb-2">
            PM試験（午後I・午後II）の合格に直結する
            <br className="hidden sm:block" />
            実践型学習アプリ
          </p>

          <p className="text-sm text-white/70 mt-8 font-mono">
            by MAMIYA　·　{VERSION_LABEL}
          </p>
        </div>
      </header>

      {/* ===== Main ===== */}
      <main className="max-w-5xl mx-auto px-6 py-12 sm:py-16 space-y-12">
        {/* ===== アプリ紹介 ===== */}
        <section aria-labelledby="intro-heading">
          <div
            className="rounded-2xl p-6 sm:p-8 shadow-sm border"
            style={{ backgroundColor: '#ffffff', borderColor: THEME.accent }}
          >
            <h2
              id="intro-heading"
              className="text-2xl font-bold mb-3"
              style={{ color: THEME.primaryDark }}
            >
              このアプリについて
            </h2>
            <p className="text-slate-700 leading-relaxed">
              本アプリはIPA「プロジェクトマネージャ試験」の
              <strong className="font-bold" style={{ color: THEME.primary }}>
                午後問題演習
              </strong>
              に特化した学習ツールです。
              午後Iの記述対策と、午後IIの論述対策を別々のアプローチで鍛えます。
              知識整理用のノート・クイズも備え、過去問データは
              <strong className="font-bold" style={{ color: THEME.primary }}>
                直近5年分（R3〜R7）
              </strong>
              を収録予定です。
            </p>
          </div>
        </section>

        {/* ===== Feature Roadmap ===== */}
        <section aria-labelledby="features-heading">
          <div className="flex items-baseline justify-between mb-6">
            <h2
              id="features-heading"
              className="text-xl sm:text-2xl font-bold"
              style={{ color: THEME.primaryDark }}
            >
              実装ロードマップ
            </h2>
            <span className="text-xs text-slate-500">
              現在: <strong style={{ color: THEME.primary }}>Phase 0</strong>（初期構築）
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <article
                key={f.title}
                className="group relative rounded-xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Phase badge */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded"
                    style={{
                      color: THEME.primary,
                      backgroundColor: THEME.bgSoft,
                      border: `1px solid ${THEME.accent}`,
                    }}
                  >
                    {f.phase.toUpperCase()}
                  </span>
                  {f.status === 'coming-next' && (
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
                      style={{ backgroundColor: THEME.primary }}
                    >
                      NEXT
                    </span>
                  )}
                </div>

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: THEME.bgSoft }}
                >
                  {f.icon('w-6 h-6')}
                  <style>{`.group .w-6 { color: ${THEME.primary} }`}</style>
                </div>

                {/* Title */}
                <h3
                  className="text-base font-bold mb-1.5 leading-snug"
                  style={{ color: THEME.primaryDark }}
                >
                  {f.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed">
                  {f.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* ===== Exam Info ===== */}
        <section aria-labelledby="exam-info-heading">
          <h2
            id="exam-info-heading"
            className="text-xl sm:text-2xl font-bold mb-6"
            style={{ color: THEME.primaryDark }}
          >
            PM試験 午後の構成
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 午後I */}
            <div
              className="rounded-xl p-6 text-white shadow-md"
              style={{
                background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryLight} 100%)`,
              }}
            >
              <div className="text-xs font-bold tracking-wider opacity-80 mb-2">AFTERNOON I</div>
              <h3 className="text-2xl font-black mb-4">午後I（記述式）</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-white/20 pb-1.5">
                  <dt className="opacity-80">形式</dt>
                  <dd className="font-semibold">記述式（短答）</dd>
                </div>
                <div className="flex justify-between border-b border-white/20 pb-1.5">
                  <dt className="opacity-80">問題数</dt>
                  <dd className="font-semibold">3問中2問選択</dd>
                </div>
                <div className="flex justify-between border-b border-white/20 pb-1.5">
                  <dt className="opacity-80">試験時間</dt>
                  <dd className="font-semibold">90分</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="opacity-80">合格基準</dt>
                  <dd className="font-semibold">60点以上</dd>
                </div>
              </dl>
            </div>

            {/* 午後II */}
            <div
              className="rounded-xl p-6 text-white shadow-md"
              style={{
                background: `linear-gradient(135deg, ${THEME.primaryDark} 0%, ${THEME.primary} 100%)`,
              }}
            >
              <div className="text-xs font-bold tracking-wider opacity-80 mb-2">AFTERNOON II</div>
              <h3 className="text-2xl font-black mb-4">午後II（論述式）</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-white/20 pb-1.5">
                  <dt className="opacity-80">形式</dt>
                  <dd className="font-semibold">論述（小論文）</dd>
                </div>
                <div className="flex justify-between border-b border-white/20 pb-1.5">
                  <dt className="opacity-80">問題数</dt>
                  <dd className="font-semibold">2問中1問選択</dd>
                </div>
                <div className="flex justify-between border-b border-white/20 pb-1.5">
                  <dt className="opacity-80">試験時間</dt>
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
        <footer className="pt-8 pb-4 text-center">
          <p className="text-xs text-slate-400">
            © MAMIYA · PM Project Manager Learning App
          </p>
        </footer>
      </main>
    </div>
  )
}
