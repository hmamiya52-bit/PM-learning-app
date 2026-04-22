import { useMemo, useState, useEffect } from 'react'
import {
  loadEpisodes,
  addEpisode,
  updateEpisode,
  deleteEpisode,
  EPISODE_TAG_LABEL,
  EPISODE_TAG_KEYS,
} from '../lib/episodes'
import type { Episode, EpisodeTag } from '../types'

const THEME = {
  primary: '#7B2D5F',
  primaryDark: '#4A1A38',
  primaryLight: '#A04080',
  accent: '#D4A5C0',
  bgSoft: '#FAF5F8',
}

type FormState = {
  title: string
  projectOverview: string
  role: string
  problem: string
  action: string
  result: string
  lesson: string
  tags: EpisodeTag[]
}

const EMPTY_FORM: FormState = {
  title: '',
  projectOverview: '',
  role: '',
  problem: '',
  action: '',
  result: '',
  lesson: '',
  tags: [],
}

const SAMPLE: FormState = {
  title: '例：基幹システム刷新プロジェクト',
  projectOverview:
    '小売業A社の基幹システム（販売管理・在庫管理）を10年ぶりに刷新。オンプレからクラウドへ移行し、業務プロセスもあわせて見直した。開発期間14ヶ月、要員平均15名、予算2.8億円。',
  role: 'プロジェクトマネージャ（PM）。ベンダー3社を束ねる立場。',
  problem:
    '稼働直前の総合テストで、既存基幹システムとの連携処理で性能が要件を満たさないことが判明。リリース期日まで残り6週間しかなかった。',
  action:
    'まず原因分析の専任チームを組成し、ボトルネックをDB/APサーバ/ネットワークの3層で切り分けた。並行してユーザー部門と協議し、リリース範囲の段階的縮退案も用意。最終的にDBのインデックス見直しとバッチ処理の並列化で解決した。',
  result:
    '当初期日から2週間遅れで稼働したが、段階縮退は回避。性能要件は2倍のマージンで達成、6ヶ月運用後もクレームなし。ユーザー部門から高評価を得た。',
  lesson:
    'リスクが顕在化した際は「最悪シナリオを先に用意」してから本命対応を行うと、意思決定が早くなる。',
  tags: ['schedule', 'risk', 'quality'],
}

export default function Episodes() {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [filterTag, setFilterTag] = useState<EpisodeTag | 'all'>('all')

  useEffect(() => {
    setEpisodes(loadEpisodes())
  }, [])

  const filtered = useMemo(() => {
    const sorted = [...episodes].sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt)
    )
    if (filterTag === 'all') return sorted
    return sorted.filter((e) => e.tags.includes(filterTag))
  }, [episodes, filterTag])

  const openNew = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setFormOpen(true)
  }

  const openEdit = (ep: Episode) => {
    setForm({
      title: ep.title,
      projectOverview: ep.projectOverview,
      role: ep.role,
      problem: ep.problem,
      action: ep.action,
      result: ep.result,
      lesson: ep.lesson ?? '',
      tags: ep.tags,
    })
    setEditingId(ep.id)
    setFormOpen(true)
  }

  const openSample = () => {
    setForm(SAMPLE)
    setEditingId(null)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingId(null)
  }

  const handleSubmit = () => {
    if (!form.title.trim()) {
      alert('タイトルは必須です。')
      return
    }
    if (editingId) {
      updateEpisode(editingId, {
        title: form.title,
        projectOverview: form.projectOverview,
        role: form.role,
        problem: form.problem,
        action: form.action,
        result: form.result,
        lesson: form.lesson || undefined,
        tags: form.tags,
      })
    } else {
      addEpisode({
        title: form.title,
        projectOverview: form.projectOverview,
        role: form.role,
        problem: form.problem,
        action: form.action,
        result: form.result,
        lesson: form.lesson || undefined,
        tags: form.tags,
      })
    }
    setEpisodes(loadEpisodes())
    closeForm()
  }

  const handleDelete = (id: string) => {
    if (!confirm('このエピソードを削除します。よろしいですか？')) return
    deleteEpisode(id)
    setEpisodes(loadEpisodes())
  }

  const toggleTag = (t: EpisodeTag) => {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(t) ? f.tags.filter((x) => x !== t) : [...f.tags, t],
    }))
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-5">
      {/* ===== ヘッダ ===== */}
      <header className="mb-4">
        <h1 className="text-xl sm:text-2xl font-bold" style={{ color: THEME.primaryDark }}>
          ネタ帳（エピソード管理）
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          自分のプロジェクト経験を登録し、午後II論文の題材として活用。課題・施策・結果・学びをSTAR形式で蓄積できます。
        </p>
      </header>

      {/* ===== コントロールバー ===== */}
      <section className="mb-4 rounded-lg bg-white border border-slate-200 px-4 py-3 shadow-sm flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600">タグ:</label>
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value as EpisodeTag | 'all')}
            className="text-sm border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2"
            style={{ outlineColor: THEME.primary }}
          >
            <option value="all">すべて</option>
            {EPISODE_TAG_KEYS.map((k) => (
              <option key={k} value={k}>
                {EPISODE_TAG_LABEL[k]}
              </option>
            ))}
          </select>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {episodes.length === 0 && (
            <button
              onClick={openSample}
              className="text-xs font-semibold px-3 py-1.5 rounded border hover:bg-slate-50 transition-colors"
              style={{ color: THEME.primary, borderColor: THEME.accent }}
            >
              📝 サンプルから作成
            </button>
          )}
          <button
            onClick={openNew}
            className="text-xs font-bold px-3 py-1.5 rounded text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: THEME.primary }}
          >
            + 新規追加
          </button>
        </div>
      </section>

      {/* ===== リスト ===== */}
      {filtered.length === 0 ? (
        <div
          className="rounded-lg bg-white border border-dashed px-6 py-12 text-center"
          style={{ borderColor: THEME.accent }}
        >
          <p className="text-sm text-slate-500 mb-3">
            {episodes.length === 0
              ? 'まだエピソードが登録されていません。'
              : 'このタグに該当するエピソードはありません。'}
          </p>
          <p className="text-xs text-slate-400 mb-4">
            午後II論文で「プロジェクトの特徴」「実施内容」「結果」を書くためのネタ（素材）を1件でも登録しておくと、本番で書きやすくなります。
          </p>
          {episodes.length === 0 && (
            <button
              onClick={openSample}
              className="text-xs font-semibold px-4 py-2 rounded text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: THEME.primary }}
            >
              サンプルを見てみる
            </button>
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((ep) => (
            <li
              key={ep.id}
              className="rounded-lg bg-white border border-slate-200 shadow-sm px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-bold" style={{ color: THEME.primaryDark }}>
                    {ep.title}
                  </h2>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {ep.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{
                          color: THEME.primary,
                          backgroundColor: THEME.bgSoft,
                          border: `1px solid ${THEME.accent}`,
                        }}
                      >
                        {EPISODE_TAG_LABEL[t]}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => openEdit(ep)}
                    className="text-xs font-semibold px-2 py-1 rounded border hover:bg-slate-50 transition-colors"
                    style={{ color: THEME.primary, borderColor: THEME.accent }}
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(ep.id)}
                    className="text-xs font-semibold px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    削除
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-700 mt-3">
                <Field label="プロジェクト概要" text={ep.projectOverview} />
                <Field label="役割" text={ep.role} />
                <Field label="課題" text={ep.problem} />
                <Field label="施策" text={ep.action} />
                <Field label="結果" text={ep.result} />
                {ep.lesson && <Field label="学び" text={ep.lesson} />}
              </div>

              <p className="text-[10px] text-slate-400 mt-2 text-right">
                更新: {ep.updatedAt.slice(0, 10)}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* ===== フォームモーダル ===== */}
      {formOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 flex items-start justify-center py-6 px-3 overflow-y-auto"
          onClick={closeForm}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div
              className="px-5 py-3 border-b flex items-center justify-between sticky top-0 bg-white rounded-t-lg"
              style={{ borderColor: THEME.accent }}
            >
              <h2 className="text-base font-bold" style={{ color: THEME.primaryDark }}>
                {editingId ? 'エピソードを編集' : 'エピソードを新規追加'}
              </h2>
              <button
                onClick={closeForm}
                className="text-slate-400 hover:text-slate-600 text-xl leading-none"
                aria-label="閉じる"
              >
                ×
              </button>
            </div>

            {/* Modal body */}
            <div className="px-5 py-4 space-y-3">
              <InputField
                label="タイトル *"
                value={form.title}
                onChange={(v) => setForm((f) => ({ ...f, title: v }))}
                placeholder="例：基幹システム刷新プロジェクト"
              />
              <TextareaField
                label="プロジェクト概要（業種・規模・期間など）"
                value={form.projectOverview}
                onChange={(v) => setForm((f) => ({ ...f, projectOverview: v }))}
                placeholder="例：小売業A社の基幹システムを刷新。開発期間14ヶ月、要員平均15名、予算2.8億円。"
                rows={3}
              />
              <InputField
                label="自分の役割"
                value={form.role}
                onChange={(v) => setForm((f) => ({ ...f, role: v }))}
                placeholder="例：プロジェクトマネージャ（PM）"
              />
              <TextareaField
                label="直面した課題（Problem）"
                value={form.problem}
                onChange={(v) => setForm((f) => ({ ...f, problem: v }))}
                placeholder="例：総合テストで既存システムとの連携処理が性能要件を満たさず、期日まで6週間。"
                rows={3}
              />
              <TextareaField
                label="実施した施策（Action）"
                value={form.action}
                onChange={(v) => setForm((f) => ({ ...f, action: v }))}
                placeholder="例：原因分析の専任チームを組成、縮退案を用意、DB最適化で解決。"
                rows={3}
              />
              <TextareaField
                label="結果（Result）"
                value={form.result}
                onChange={(v) => setForm((f) => ({ ...f, result: v }))}
                placeholder="例：2週間遅れで稼働、性能要件は2倍のマージンで達成。"
                rows={2}
              />
              <TextareaField
                label="学び（任意）"
                value={form.lesson}
                onChange={(v) => setForm((f) => ({ ...f, lesson: v }))}
                placeholder="例：リスク顕在化時は最悪シナリオを先に用意してから本命対応。"
                rows={2}
              />

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  適用できる領域（タグ）
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {EPISODE_TAG_KEYS.map((t) => {
                    const active = form.tags.includes(t)
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleTag(t)}
                        className="text-xs font-semibold px-2 py-1 rounded border transition-colors"
                        style={{
                          color: active ? '#ffffff' : THEME.primary,
                          backgroundColor: active ? THEME.primary : '#ffffff',
                          borderColor: THEME.accent,
                        }}
                      >
                        {EPISODE_TAG_LABEL[t]}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div
              className="px-5 py-3 border-t flex items-center justify-end gap-2"
              style={{ borderColor: THEME.accent }}
            >
              <button
                onClick={closeForm}
                className="text-sm font-semibold px-4 py-1.5 rounded border hover:bg-slate-50 transition-colors"
                style={{ color: '#64748b', borderColor: '#e2e8f0' }}
              >
                キャンセル
              </button>
              <button
                onClick={handleSubmit}
                className="text-sm font-bold px-4 py-1.5 rounded text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: THEME.primary }}
              >
                {editingId ? '更新' : '追加'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ------------------------------------------------------------
// Helper components
// ------------------------------------------------------------
function Field({ label, text }: { label: string; text: string }) {
  if (!text) return null
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</dt>
      <dd className="mt-0.5 leading-relaxed whitespace-pre-wrap">{text}</dd>
    </div>
  )
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2"
        style={{ outlineColor: THEME.primary }}
      />
    </div>
  )
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 resize-y leading-relaxed"
        style={{ outlineColor: THEME.primary }}
      />
    </div>
  )
}
