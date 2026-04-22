import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { afternoon2Problems } from '../data/afternoon2Problems'
import { listDrafts, countChars } from '../lib/afternoon2'

const THEME = {
  primary: '#7B2D5F',
  primaryDark: '#4A1A38',
  primaryLight: '#A04080',
  accent: '#D4A5C0',
  bgSoft: '#FAF5F8',
}

export default function Afternoon2Problems() {
  const [filterYear, setFilterYear] = useState<string>('all')

  const drafts = useMemo(() => listDrafts(), [])
  const draftMap = useMemo(() => {
    const m: Record<string, { chars: number; updatedAt: string }> = {}
    for (const d of drafts) {
      m[d.problemId] = {
        chars: countChars(d.sectionA) + countChars(d.sectionB) + countChars(d.sectionC),
        updatedAt: d.updatedAt,
      }
    }
    return m
  }, [drafts])

  const years = useMemo(() => {
    const set = new Set(afternoon2Problems.map((p) => p.year))
    return Array.from(set).sort().reverse()
  }, [])

  const filtered = useMemo(() => {
    return afternoon2Problems.filter((p) => {
      if (filterYear !== 'all' && p.year !== filterYear) return false
      return true
    })
  }, [filterYear])

  return (
    <div className="max-w-5xl mx-auto px-4 py-5">
      {/* ===== ヘッダ ===== */}
      <header className="mb-4">
        <h1 className="text-xl sm:text-2xl font-bold" style={{ color: THEME.primaryDark }}>
          午後II 論述トレーニング
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          過去5年分（R3〜R7）の午後II問題。設問ア/イ/ウごとに文字数カウントとタイマー付きで論文を練習できます。
        </p>
      </header>

      {/* ===== フィルタ ===== */}
      <section className="mb-4 rounded-lg bg-white border border-slate-200 px-4 py-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">年度:</label>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="text-sm border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2"
              style={{ outlineColor: THEME.primary }}
            >
              <option value="all">すべて</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <Link
            to="/episodes"
            className="ml-auto text-xs font-semibold px-3 py-1 rounded border transition-colors"
            style={{ color: THEME.primary, borderColor: THEME.accent }}
          >
            💡 ネタ帳を開く
          </Link>
        </div>
      </section>

      {/* ===== 問題一覧 ===== */}
      <section>
        <div className="rounded-lg bg-white border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr
                className="text-white text-xs"
                style={{ backgroundColor: THEME.primary }}
              >
                <th className="text-left px-3 py-2 font-semibold">年度</th>
                <th className="text-left px-3 py-2 font-semibold">問</th>
                <th className="text-left px-3 py-2 font-semibold">テーマ</th>
                <th className="text-left px-3 py-2 font-semibold hidden md:table-cell">キーワード</th>
                <th className="text-center px-3 py-2 font-semibold w-36">下書き</th>
                <th className="text-right px-3 py-2 font-semibold w-32">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const d = draftMap[p.id]
                return (
                  <tr
                    key={p.id}
                    className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-3 py-2 whitespace-nowrap font-semibold" style={{ color: THEME.primaryDark }}>
                      {p.year}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span
                        className="inline-block text-xs font-bold px-1.5 py-0.5 rounded text-white"
                        style={{ backgroundColor: THEME.primaryLight }}
                      >
                        問{p.number}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <p className="font-medium text-slate-800">{p.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{p.theme}</p>
                    </td>
                    <td className="px-3 py-2 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {p.keywords.slice(0, 3).map((k) => (
                          <span
                            key={k}
                            className="text-[10px] px-1.5 py-0.5 rounded"
                            style={{
                              color: THEME.primary,
                              backgroundColor: THEME.bgSoft,
                              border: `1px solid ${THEME.accent}`,
                            }}
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center whitespace-nowrap">
                      {d ? (
                        <div>
                          <span
                            className="inline-block text-[10px] font-bold px-2 py-0.5 rounded text-white"
                            style={{ backgroundColor: '#10b981' }}
                          >
                            {d.chars.toLocaleString()}字
                          </span>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {d.updatedAt.slice(0, 10)}
                          </div>
                        </div>
                      ) : (
                        <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded text-slate-500 bg-slate-100">
                          未着手
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">
                      <Link
                        to={`/afternoon2/${p.id}/practice`}
                        className="text-xs font-semibold px-3 py-1 rounded text-white hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: THEME.primary }}
                      >
                        論述する
                      </Link>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-slate-400 text-sm">
                    条件に一致する問題がありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[11px] text-slate-400">
          {filtered.length} 件 / 全 {afternoon2Problems.length} 件
        </p>
      </section>
    </div>
  )
}
