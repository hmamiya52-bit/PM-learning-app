// ------------------------------------------------------------
// PM学習アプリ 型定義
// ------------------------------------------------------------

/**
 * 午後Iの1問を表すメタデータ
 */
export interface Afternoon1Problem {
  id: string           // e.g. 'R7-PM1-1'
  year: string         // 'R3' | 'R4' | 'R5' | 'R6' | 'R7'
  yearLabel: string    // 'R7（2025）'
  number: 1 | 2 | 3    // 問1 / 問2 / 問3
  title: string        // 問題のテーマ
  keywords: string[]   // 検索/フィルタ用
  questionPdfUrl?: string  // IPA公式問題PDFへのリンク
  answerPdfUrl?: string    // IPA公式解答例PDFへのリンク
}

/**
 * 午後Iの模範解答 1行
 * NWSPの AnswerRow をベースに踏襲。
 */
export interface Afternoon1AnswerRow {
  s: string        // 設問番号 "1" | "2" | "3"
  q?: string       // 小問 "(1)" | "(2)" | ...
  t?: string       // 解答欄ラベル "a" | "①" | ...
  a: string        // 解答例テキスト
  essay?: boolean  // 記述式（数十字程度）
}

/**
 * 午後I問題 1問分の模範解答セット
 */
export interface Afternoon1OfficialAnswer {
  id: string            // Afternoon1Problem.id と一致
  year: string
  number: 1 | 2 | 3
  pdfUrl?: string       // IPA公式解答例PDFへのリンク
  answers: Afternoon1AnswerRow[]
}

/**
 * 演習記録（自己採点結果）
 */
export interface PracticeRecord {
  id: string           // UUID
  problemId: string    // Afternoon1Problem.id
  date: string         // 'YYYY-MM-DD'
  score: number        // 自己採点スコア
  durationSec?: number // 演習にかけた秒数
  memo?: string
}

/**
 * 学習計画（問題に予定日を紐付け）
 */
export type PlanMap = Record<string, string>  // problemId → 'YYYY-MM-DD'

// ------------------------------------------------------------
// ノート（知識整理）
// ------------------------------------------------------------

/**
 * ノートカテゴリ（PMBOK知識エリア＋横断トピック）
 */
export type NoteCategory =
  | 'integration'     // 統合管理
  | 'scope'           // スコープ管理
  | 'schedule'        // スケジュール管理
  | 'cost'            // コスト管理
  | 'quality'         // 品質管理
  | 'resource'        // 資源管理
  | 'communication'   // コミュニケーション管理
  | 'risk'            // リスク管理
  | 'procurement'     // 調達管理
  | 'stakeholder'     // ステークホルダー管理
  | 'process'         // プロセス/プロセス群
  | 'agile'           // アジャイル/ハイブリッド
  | 'exam'            // 試験対策Tips

// NOTE: 構造化ノート（セクション＋==赤字==マーク）本体は
// src/data/noteContent.ts の NoteData / NoteSection を参照。

// ------------------------------------------------------------
// クイズ
// ------------------------------------------------------------

export type QuizDifficulty = 'easy' | 'normal' | 'hard'

export interface QuizQuestion {
  id: string
  category: NoteCategory   // ノートと共通のカテゴリ
  question: string
  choices: string[]        // 4択想定
  correctIndex: number
  explanation: string
  difficulty: QuizDifficulty
}

/**
 * クイズの解答記録（1問ごと）
 */
export interface QuizAttempt {
  id: string
  quizId: string
  date: string       // 'YYYY-MM-DD'
  correct: boolean
  pickedIndex: number
  timeMs?: number
}

// ------------------------------------------------------------
// 午後II（論述）
// ------------------------------------------------------------

/**
 * 午後II 問題メタデータ
 */
export interface Afternoon2Problem {
  id: string             // e.g. 'R7-PM2-1'
  year: string
  yearLabel: string
  number: 1 | 2
  title: string
  theme: string          // 論述テーマ（要約）
  keywords: string[]
  /** 設問ア〜ウの指示文 */
  promptA: string
  promptB: string
  promptC: string
  questionPdfUrl?: string
}

/** 設問の章立て */
export type EssaySection = 'a' | 'b' | 'c'

/**
 * 論述ドラフト（章ごとのテキストを保存）
 */
export interface EssayDraft {
  id: string             // = problemId
  problemId: string
  sectionA: string
  sectionB: string
  sectionC: string
  updatedAt: string      // ISO datetime
  elapsedSec?: number    // 累計経過秒（タイマー）
}

// ------------------------------------------------------------
// ネタ帳（エピソード管理）
// ------------------------------------------------------------

/**
 * エピソードがカバーするPM領域タグ
 */
export type EpisodeTag =
  | 'integration'
  | 'scope'
  | 'schedule'
  | 'cost'
  | 'quality'
  | 'resource'
  | 'communication'
  | 'risk'
  | 'procurement'
  | 'stakeholder'
  | 'agile'
  | 'other'

/**
 * 論文のネタになるプロジェクト経験 1件
 */
export interface Episode {
  id: string
  title: string                  // 「基幹システム刷新」など
  projectOverview: string        // プロジェクト概要（設問ア用）
  role: string                   // 自身の立場・役割
  problem: string                // 直面した課題
  action: string                 // 実施した施策・工夫
  result: string                 // 結果・評価
  lesson?: string                // 学び・振り返り
  tags: EpisodeTag[]             // 適用できるPM領域
  createdAt: string              // ISO datetime
  updatedAt: string              // ISO datetime
}
