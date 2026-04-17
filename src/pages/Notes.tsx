import { useMemo, useState, useCallback } from 'react'
import type { Note, NoteCategory } from '../types'
import { NOTE_CATEGORIES, getCategoryMeta } from '../data/noteCategories'
import { loadAllNotes, addNote, updateNote, deleteNote } from '../lib/notes'

const THEME = {
  primary: '#7B2D5F',
  primaryDark: '#4A1A38',
  primaryLight: '#A04080',
  accent: '#D4A5C0',
  bgSoft: '#FAF5F8',
}

type CategoryFilter = NoteCategory | 'all'

// ----------------------------------------------------------------
// 編集モーダル
// ----------------------------------------------------------------
interface EditorProps {
  note?: Note   // undefined → 新規作成
  defaultCategory: NoteCategory
  onSave: () => void
  onCancel: () => void
}

function NoteEditor({ note, defaultCategory, onSave, onCancel }: EditorProps) {
  const [title, setTitle] = useState(note?.title ?? '')
  const [content, setContent] = useState(note?.content ?? '')
  const [category, setCategory] = useState<NoteCategory>(note?.category ?? defaultCategory)
  const [tagsText, setTagsText] = useState((note?.tags ?? []).join(', '))

  const handleSubmit = () => {
    const tags = tagsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    if (note) {
      updateNote(note.id, { title, content, category, tags })
    } else {
      addNote({ title, content, category, tags })
    }
    onSave()
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center px-3"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダ */}
        <div
          className="px-4 py-2.5 flex items-center justify-between text-white rounded-t-lg"
          style={{ backgroundColor: THEME.primary }}
        >
          <h2 className="text-sm font-bold">
            {note ? 'ノートを編集' : '新しいノート'}
          </h2>
          <button
            onClick={onCancel}
            className="text-white/80 hover:text-white text-xs"
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>

        {/* 本体 */}
        <div className="p-4 space-y-3 overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              カテゴリ
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as NoteCategory)}
              className="w-full text-sm border border-slate-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2"
              style={{ outlineColor: THEME.primary }}
            >
              {NOTE_CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              タイトル
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: リスク対応戦略（Avoid / Transfer / Mitigate / Accept）"
              className="w-full text-sm border border-slate-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2"
              style={{ outlineColor: THEME.primary }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              本文
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              placeholder="箇条書き・Markdown風記法もそのまま保存されます"
              className="w-full text-sm border border-slate-300 rounded px-2 py-1.5 font-mono focus:outline-none focus:ring-2"
              style={{ outlineColor: THEME.primary }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              タグ（カンマ区切り）
            </label>
            <input
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="例: リスク, Avoid, Transfer"
              className="w-full text-sm border border-slate-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2"
              style={{ outlineColor: THEME.primary }}
            />
          </div>
        </div>

        {/* フッタ */}
        <div className="px-4 py-3 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="text-xs font-semibold px-3 py-1.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-50"
          >
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
            className="text-xs font-semibold px-3 py-1.5 rounded text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: THEME.primary }}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}

// ----------------------------------------------------------------
// Notes ページ本体
// ----------------------------------------------------------------
export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(() => loadAllNotes())
  const [filter, setFilter] = useState<CategoryFilter>('all')
  const [keyword, setKeyword] = useState('')
  const [editing, setEditing] = useState<{ mode: 'new' | 'edit'; note?: Note } | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const reload = useCallback(() => {
    setNotes(loadAllNotes())
    setEditing(null)
  }, [])

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    return notes.filter((n) => {
      if (filter !== 'all' && n.category !== filter) return false
      if (kw) {
        const hit =
          n.title.toLowerCase().includes(kw) ||
          n.content.toLowerCase().includes(kw) ||
          n.tags.some((t) => t.toLowerCase().includes(kw))
        if (!hit) return false
      }
      return true
    })
  }, [notes, filter, keyword])

  const categoryCounts = useMemo(() => {
    const map = new Map<NoteCategory, number>()
    for (const n of notes) {
      map.set(n.category, (map.get(n.category) ?? 0) + 1)
    }
    return map
  }, [notes])

  const handleDelete = (id: string) => {
    if (!window.confirm('このノートを削除しますか？（シードノートは非表示になります）')) return
    deleteNote(id)
    reload()
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-5">
      {/* ===== ヘッダ ===== */}
      <header className="mb-4 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold" style={{ color: THEME.primaryDark }}>
            ノート（知識整理）
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            PMBOK 10知識エリア＋横断トピックごとに、要点をストックして試験対策に使えます。
          </p>
        </div>
        <button
          onClick={() => setEditing({ mode: 'new' })}
          className="text-xs font-semibold px-3 py-1.5 rounded text-white shadow-sm hover:opacity-90"
          style={{ backgroundColor: THEME.primary }}
        >
          ＋ 新しいノート
        </button>
      </header>

      {/* ===== カテゴリタブ ===== */}
      <section className="mb-3">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilter('all')}
            className="text-xs font-semibold px-2.5 py-1 rounded-full transition-colors"
            style={{
              backgroundColor: filter === 'all' ? THEME.primary : '#ffffff',
              color: filter === 'all' ? '#ffffff' : THEME.primary,
              border: `1px solid ${THEME.accent}`,
            }}
          >
            すべて ({notes.length})
          </button>
          {NOTE_CATEGORIES.map((c) => {
            const n = categoryCounts.get(c.key) ?? 0
            const active = filter === c.key
            return (
              <button
                key={c.key}
                onClick={() => setFilter(c.key)}
                className="text-xs font-semibold px-2.5 py-1 rounded-full transition-colors"
                style={{
                  backgroundColor: active ? THEME.primary : '#ffffff',
                  color: active ? '#ffffff' : THEME.primary,
                  border: `1px solid ${THEME.accent}`,
                  opacity: n === 0 ? 0.5 : 1,
                }}
              >
                {c.label} ({n})
              </button>
            )
          })}
        </div>
      </section>

      {/* ===== 検索 ===== */}
      <section className="mb-3">
        <input
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="タイトル・本文・タグで検索"
          className="w-full text-sm border border-slate-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2"
          style={{ outlineColor: THEME.primary }}
        />
      </section>

      {/* ===== ノート一覧 ===== */}
      <section>
        {filtered.length === 0 ? (
          <div className="rounded-lg bg-white border border-slate-200 px-4 py-8 text-center text-slate-400 text-sm">
            条件に一致するノートがありません
          </div>
        ) : (
          <ul className="space-y-2">
            {filtered.map((n) => {
              const meta = getCategoryMeta(n.category)
              const expanded = expandedId === n.id
              return (
                <li
                  key={n.id}
                  className="rounded-lg bg-white border border-slate-200 shadow-sm overflow-hidden"
                >
                  {/* カード上部：常に表示 */}
                  <button
                    onClick={() => setExpandedId(expanded ? null : n.id)}
                    className="w-full text-left px-3 py-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                        style={{
                          color: THEME.primary,
                          backgroundColor: THEME.bgSoft,
                          border: `1px solid ${THEME.accent}`,
                        }}
                      >
                        {meta.label}
                      </span>
                      {n.seed && (
                        <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-slate-100 text-slate-500">
                          シード
                        </span>
                      )}
                      <h3 className="text-sm font-bold text-slate-800 truncate flex-1">
                        {n.title}
                      </h3>
                      <span className="text-[10px] text-slate-400">
                        {expanded ? '▲' : '▼'}
                      </span>
                    </div>
                    {!expanded && (
                      <p className="mt-1 text-[11px] text-slate-500 line-clamp-2 leading-snug">
                        {n.content.slice(0, 120)}
                      </p>
                    )}
                  </button>

                  {/* 展開時：本文＋操作 */}
                  {expanded && (
                    <div className="border-t border-slate-100 px-3 py-2.5">
                      <pre className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
                        {n.content}
                      </pre>
                      {n.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {n.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] px-1.5 py-0.5 rounded"
                              style={{
                                color: THEME.primaryDark,
                                backgroundColor: THEME.bgSoft,
                              }}
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                        <p className="text-[10px] text-slate-400">
                          更新: {new Date(n.updatedAt).toLocaleDateString()}
                        </p>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setEditing({ mode: 'edit', note: n })}
                            className="text-xs font-semibold px-2 py-1 rounded border hover:bg-slate-50"
                            style={{ color: THEME.primary, borderColor: THEME.accent }}
                          >
                            編集
                          </button>
                          <button
                            onClick={() => handleDelete(n.id)}
                            className="text-xs font-semibold px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50"
                          >
                            {n.seed ? '非表示' : '削除'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
        <p className="mt-3 text-[10px] text-slate-400">
          {filtered.length} 件 / 全 {notes.length} 件
        </p>
      </section>

      {editing && (
        <NoteEditor
          note={editing.note}
          defaultCategory={filter === 'all' ? 'integration' : filter}
          onSave={reload}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  )
}
