import { Link, useParams } from 'react-router-dom'
import { afternoon1Problems } from '../data/afternoon1Problems'
import { findAnswer } from '../data/afternoon1Answers'

const THEME = {
  primary: '#7B2D5F',
  primaryDark: '#4A1A38',
  primaryLight: '#A04080',
  accent: '#D4A5C0',
  bgSoft: '#FAF5F8',
}

export default function Afternoon1Answer() {
  const { id } = useParams<{ id: string }>()
  const problem = afternoon1Problems.find((p) => p.id === id)
  const answerSet = id ? findAnswer(id) : undefined

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

  return (
    <div className="max-w-5xl mx-auto px-4 py-5">
      {/* ===== パンくず ===== */}
      <div className="mb-2">
        <Link to="/afternoon1" className="text-xs hover:underline" style={{ color: THEME.primary }}>
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
                {problem.year} 午後I 模範解答
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/20">
                問{problem.number}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black leading-tight">
              {problem.title}
            </h1>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Link
              to={`/afternoon1/${problem.id}/practice`}
              className="text-xs font-semibold px-3 py-1.5 rounded bg-white/20 hover:bg-white/30 transition-colors whitespace-nowrap"
            >
              この問題を演習する →
            </Link>
            {answerSet?.pdfUrl && (
              <a
                href={answerSet.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] opacity-80 hover:opacity-100 underline"
              >
                IPA公式解答PDF ↗
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ===== 解答表 ===== */}
      {!answerSet || answerSet.answers.length === 0 ? (
        <section className="rounded-lg bg-white border border-slate-200 px-4 py-8 shadow-sm text-center">
          <p className="text-sm text-slate-500 mb-2">
            この問題の模範解答データはまだ登録されていません。
          </p>
          <p className="text-xs text-slate-400">
            IPA公式解答PDFを参照するか、
            <code className="bg-slate-100 px-1 rounded">src/data/afternoon1Answers.ts</code>
            {' '}に追加してください。
          </p>
        </section>
      ) : (
        <section className="rounded-lg bg-white border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs" style={{ backgroundColor: THEME.bgSoft, color: THEME.primaryDark }}>
                <th className="text-left px-3 py-2 font-semibold w-16">設問</th>
                <th className="text-left px-3 py-2 font-semibold w-16">小問</th>
                <th className="text-left px-3 py-2 font-semibold w-20">ラベル</th>
                <th className="text-left px-3 py-2 font-semibold">解答例</th>
              </tr>
            </thead>
            <tbody>
              {answerSet.answers.map((row, idx) => (
                <tr key={idx} className="border-t border-slate-100 align-top">
                  <td className="px-3 py-2 font-semibold text-slate-700">{row.s}</td>
                  <td className="px-3 py-2 text-slate-600">{row.q ?? ''}</td>
                  <td className="px-3 py-2 text-slate-600">{row.t ?? ''}</td>
                  <td className="px-3 py-2 leading-relaxed" style={{ color: THEME.primaryDark }}>
                    {row.a}
                    {row.essay && (
                      <span className="ml-2 text-[10px] text-slate-400">
                        （{row.a.length} 字・記述）
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <p className="mt-3 text-[10px] text-slate-400">
        出典: 独立行政法人情報処理推進機構（IPA）公式解答例
      </p>
    </div>
  )
}
