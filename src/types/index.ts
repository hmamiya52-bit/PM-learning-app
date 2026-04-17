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
