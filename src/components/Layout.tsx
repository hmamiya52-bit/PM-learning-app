import { useState, useEffect, useCallback } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import PwaInstallPrompt from './PwaInstallPrompt'

// ----------------------------------------------------------------
// Theme
// ----------------------------------------------------------------
const THEME = {
  primary: '#7B2D5F',
  primaryDark: '#4A1A38',   // サイドバー・ヘッダ背景
  primaryLight: '#A04080',
  accent: '#D4A5C0',
}

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
interface NavItem {
  label: string
  to: string
  icon: React.ReactNode
  disabled?: boolean
}

// ----------------------------------------------------------------
// Icons (inline SVG)
// ----------------------------------------------------------------
function IconHouse() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}
function IconFileText() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}
function IconEdit() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  )
}
function IconBook() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  )
}
function IconQuestion() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093V14m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
function IconChart() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}
function IconLightbulb() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  )
}
function IconTarget() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}
function IconMenu() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}
function IconClose() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

// ----------------------------------------------------------------
// Navigation items
// ----------------------------------------------------------------
const NAV_ITEMS: NavItem[] = [
  { label: 'ホーム', to: '/', icon: <IconHouse /> },
  { label: '午後I 演習', to: '/afternoon1', icon: <IconFileText /> },
  { label: '午後II 論述', to: '/afternoon2', icon: <IconEdit />, disabled: true },
  { label: 'ネタ帳', to: '/episodes', icon: <IconLightbulb />, disabled: true },
  { label: 'ノート', to: '/notes', icon: <IconBook />, disabled: true },
  { label: 'クイズ', to: '/quiz', icon: <IconQuestion />, disabled: true },
  { label: '進捗トラッカー', to: '/tracker', icon: <IconChart />, disabled: true },
]

const STORAGE_KEY = 'pm_sidebar_open'

// ----------------------------------------------------------------
// Layout
// ----------------------------------------------------------------
export default function Layout() {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    if (window.innerWidth < 768) return false
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored !== null) return JSON.parse(stored) as boolean
    } catch {
      // ignore
    }
    return true
  })

  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(isOpen))
    } catch {
      // ignore
    }
  }, [isOpen])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])
  const close = useCallback(() => setIsOpen(false), [])

  const handleNavClick = useCallback(() => {
    if (isMobile) close()
  }, [isMobile, close])

  const sidebarWidth = isOpen ? 240 : 56
  const contentMargin = isMobile ? 0 : sidebarWidth

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF5F8' }}>
      {/* ===== Header ===== */}
      <header
        className="fixed top-0 left-0 right-0 z-30 flex items-center h-12 px-3 gap-3 text-white shadow-md"
        style={{ backgroundColor: THEME.primaryDark }}
      >
        <button
          onClick={toggle}
          className="p-2 rounded-lg hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors flex-shrink-0"
          aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
          aria-expanded={isOpen}
          aria-controls="sidebar"
        >
          {isOpen && isMobile ? <IconClose /> : <IconMenu />}
        </button>

        <Link
          to="/"
          className="flex items-center gap-2 flex-1 min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
          aria-label="プロジェクトマネージャへの道 ホームへ"
        >
          <div
            className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: THEME.primary }}
            aria-hidden="true"
          >
            <IconTarget />
          </div>
          <span className="text-sm font-semibold leading-none truncate" style={{ color: THEME.accent }}>
            プロジェクトマネージャへの道
          </span>
        </Link>
      </header>

      <div className="flex flex-1 pt-12">
        {/* ===== Mobile backdrop ===== */}
        {isMobile && isOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/40"
            style={{ top: 48 }}
            onClick={close}
            aria-hidden="true"
          />
        )}

        {/* ===== Sidebar ===== */}
        <nav
          id="sidebar"
          aria-label="メインナビゲーション"
          className="fixed top-12 bottom-0 z-20 flex flex-col overflow-hidden transition-[width] duration-200 ease-in-out"
          style={{
            width: isMobile ? (isOpen ? 240 : 0) : sidebarWidth,
            backgroundColor: THEME.primaryDark,
          }}
        >
          <ul className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                {item.disabled ? (
                  <div
                    title={`${item.label}（実装予定）`}
                    className="flex items-center gap-3 px-4 py-2.5 text-white/40 cursor-not-allowed"
                    style={{ minWidth: 240 }}
                    aria-disabled="true"
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span
                      className="text-sm font-medium whitespace-nowrap transition-opacity duration-150 flex items-center gap-1.5"
                      style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' }}
                    >
                      {item.label}
                      <span
                        className="text-[9px] px-1 py-0.5 rounded border border-white/20"
                      >
                        予定
                      </span>
                    </span>
                  </div>
                ) : (
                  <NavLink
                    to={item.to}
                    onClick={handleNavClick}
                    end={item.to === '/'}
                    title={item.label}
                    className={({ isActive }) =>
                      [
                        'flex items-center gap-3 px-4 py-2.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white',
                        isActive
                          ? 'text-white bg-white/15 border-l-2'
                          : 'text-white/80 hover:text-white hover:bg-white/10 border-l-2 border-transparent',
                      ].join(' ')
                    }
                    style={({ isActive }) =>
                      isActive
                        ? { minWidth: 240, borderLeftColor: THEME.accent }
                        : { minWidth: 240 }
                    }
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span
                      className="text-sm font-medium whitespace-nowrap transition-opacity duration-150"
                      style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' }}
                    >
                      {item.label}
                    </span>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>

          {/* Sidebar footer */}
          {isOpen && (
            <div className="px-4 py-3 border-t border-white/10">
              <p className="text-[10px] text-white/40 whitespace-nowrap">
                PM Learning App · by MAMIYA
              </p>
            </div>
          )}
        </nav>

        {/* ===== Main content ===== */}
        <main
          className="flex-1 min-w-0 transition-[margin-left] duration-200 ease-in-out"
          style={{ marginLeft: contentMargin }}
        >
          <Outlet />
        </main>
      </div>

      <PwaInstallPrompt />
    </div>
  )
}
