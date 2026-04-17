import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { afternoon1Problems } from '../data/afternoon1Problems'
import { findAnswer } from '../data/afternoon1Answers'
import { loadRecords } from '../lib/tracker'

const THEME = {
  primary: '#7B2D5F',
  primaryDark: '#4A1A38',
  primaryLight: '#A04080',
  accent: '#D4A5C0',
  bgSoft: '#FAF5F8',
}

export default function Afternoon1Problems() {
  const records = useMemo(() => loadRecords(), [])
  const [filterYear, setFilterYear] = useState<string>('all')
  const [filterKeyword, setFilterKeyword] = useState<string>('')
  const [answerOnly, setAnswerOnly] = useState(false)

  // 学習済みかどうか（演習記録が1件以上）
  const studiedIds = useMemo(
    () => new Set(records.map((r) => r.problemId)),
    [records]
  )

  // 年度一覧
  const years = useMemo(() => {
    const set = new Set(afternoon1Problems.map((p) => p.year))
    return Array.from(set).sort().reverse()
  }, [])

  // キーワード一覧（ユニーク）
  const allKeywords = useMemo(() => {
    const set = new Set<string>()
    afternoon1Problems.forEach((p) => p.keywords.forEach((k) => set.add(k)))
    return Array.from(set).sort()
  }, [])

  // フィルタ後の問題
  const filtered = useMemo(() => {
    return afternoon1Problems.filter((p) => {
      if (filterYear !== 'all' && p.year !== filterYear) return false
      if (filterKeyword && !p.keywords.some((k) => k.includes(filterKeyword))) return false
      if (answerOnly && !findAnswer(p.id)) return false
      return true
    })
  }, [filterYear, filterKeyword, answerOnly])

  return (
    <div className="max-w-5xl mx-auto px-4 py-5">
      {/* ===== ヘッダ ===== */}
      <header className="mb-4">
        <h1 className="text-xl sm:text-2xl font-bold" style={{ color: THEME.primaryDark }}>
          午後I 問題演習
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          過去5年分（R3〜R7）の午後I問題。タイマー付きで演習し、模範解答と比較して自己採点できます。
        </p>
      </header>

      {/* ===== フィルタ ===== */}
      <section className="mb-4 rounded-lg bg-white border border-slate-200 px-4 py-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* 年度 */}
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

          {/* キーワード */}
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">キーワード:</label>
            <select
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.target.value)}
              className="text-sm border border-slate-300 rounded px-2 py-1 flex-1 focus:outline-none focus:ring-2"
              style={{ outlineColor: THEME.primary }}
            >
              <option value="">すべて</option>
              {allKeywords.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          {/* 解答データのみ */}
          <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={answerOnly}
              onChange={(e) => setAnswerOnly(e.target.checked)}
              className="accent-current"
              style={{ accentColor: THEME.primary }}
            />
            模範解答ありのみ
          </label>
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
                <th className="text-center px-3 py-2 font-semibold w-32">状態</th>
                <th className="text-right px-3 py-2 font-semibold w-48">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const hasAnswer = !!findAnswer(p.id)
                const isStudied = studiedIds.has(p.id)
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
                      <div className="md:hidden mt-0.5 text-[10px] text-slate-500">
                        {p.keywords.slice(0, 2).join(' / ')}
                      </div>
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
                    <td className="px-3 py-2 text-center">
                      {isStudied ? (
                        <span
                          className="inline-block text-[10px] font-bold px-2 py-0.5 rounded text-white"
                          style={{ backgroundColor: '#10b981' }}
                        >
                          学習済み
                        </span>
                      ) : (
                        <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded text-slate-500 bg-slate-100">
                          未学習
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">
                      <div className="inline-flex gap-1">
                        <Link
                          to={`/afternoon1/${p.id}/practice`}
                          className="text-xs font-semibold px-2 py-1 rounded text-white hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: THEME.primary }}
                        >
                          演習
                        </Link>
                        <Link
                          to={`/afternoon1/${p.id}/answer`}
                          className={`text-xs font-semibold px-2 py-1 rounded border transition-colors ${
                            hasAnswer
                              ? 'hover:bg-slate-50'
                              : 'opacity-40 cursor-not-allowed pointer-events-none'
                          }`}
                          style={{ color: THEME.primary, borderColor: THEME.accent }}
                        >
                          解答
                        </Link>
                      </div>
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
          {filtered.length} 件 / 全 {afternoon1Problems.length} 件
        </p>
      </section>
    </div>
  )
}
