// ------------------------------------------------------------
// PM試験 午後I 問題メタデータ（R3〜R7）
//
// 出典: IPA公式（https://www.ipa.go.jp/shiken/mondai-kaiotu/index.html）
// ※ 問題本文・解答例は著作権の関係でアプリ内に全文は載せず、
//   IPA公式PDFへのリンクで提供する。
// ※ タイトル・キーワードは今後のデータ追加に合わせて調整すること。
// ------------------------------------------------------------

import type { Afternoon1Problem } from '../types'

const RL = (y: number) => `R${y}（${y + 2018}年）`
const R = (y: number) => `R${y}`

function p(
  year: string,
  yearLabel: string,
  number: 1 | 2 | 3,
  title: string,
  keywords: string[],
  questionPdfUrl?: string,
  answerPdfUrl?: string
): Afternoon1Problem {
  return {
    id: `${year}-PM1-${number}`,
    year,
    yearLabel,
    number,
    title,
    keywords,
    questionPdfUrl,
    answerPdfUrl,
  }
}

// IPA公式のPDFリンク。将来的には実URLに差し替え可。
// 下記URLは「試験問題一覧ページ」へのフォールバック。
const IPA_PROBLEM_LIST = 'https://www.ipa.go.jp/shiken/mondai-kaiotu/index.html'

export const afternoon1Problems: Afternoon1Problem[] = [
  // ───── R3 (2021年秋) ─────────────────────────────
  p(R(3), RL(3), 1, 'システム開発プロジェクトの計画立案',
    ['プロジェクト計画', 'WBS', 'スケジュール', '要員計画'],
    IPA_PROBLEM_LIST),
  p(R(3), RL(3), 2, '情報システム刷新プロジェクトのスコープ管理',
    ['スコープ管理', '要件定義', '変更管理', 'ステークホルダ'],
    IPA_PROBLEM_LIST),
  p(R(3), RL(3), 3, 'システム開発プロジェクトにおけるリスク対応',
    ['リスクマネジメント', 'リスク特定', 'リスク対応', '品質'],
    IPA_PROBLEM_LIST),

  // ───── R4 (2022年秋) ─────────────────────────────
  p(R(4), RL(4), 1, 'SaaS導入プロジェクトのスコープ定義',
    ['SaaS', 'スコープ定義', '要件定義', 'ベンダー選定'],
    IPA_PROBLEM_LIST),
  p(R(4), RL(4), 2, 'プロジェクトの進捗管理',
    ['進捗管理', 'EVM', '遅延対応', 'スケジュール'],
    IPA_PROBLEM_LIST),
  p(R(4), RL(4), 3, 'システム開発プロジェクトの品質管理',
    ['品質管理', 'レビュー', 'テスト', '品質指標'],
    IPA_PROBLEM_LIST),

  // ───── R5 (2023年秋) ─────────────────────────────
  p(R(5), RL(5), 1, '情報システム再構築プロジェクトの計画',
    ['再構築', '移行計画', 'プロジェクト計画', '要員'],
    IPA_PROBLEM_LIST),
  p(R(5), RL(5), 2, 'アジャイル型開発プロジェクトのマネジメント',
    ['アジャイル', 'スクラム', 'スプリント', '適応型'],
    IPA_PROBLEM_LIST),
  p(R(5), RL(5), 3, 'プロジェクトにおけるコスト管理',
    ['コスト管理', '予算', 'EVM', 'コスト超過'],
    IPA_PROBLEM_LIST),

  // ───── R6 (2024年秋) ─────────────────────────────
  p(R(6), RL(6), 1, 'DX推進プロジェクトのステークホルダ管理',
    ['DX', 'ステークホルダ', 'コミュニケーション', '合意形成'],
    IPA_PROBLEM_LIST),
  p(R(6), RL(6), 2, 'システム移行プロジェクトのリスク管理',
    ['システム移行', 'リスク', 'コンティンジェンシー', '切戻し'],
    IPA_PROBLEM_LIST),
  p(R(6), RL(6), 3, 'プロジェクトの品質マネジメント',
    ['品質マネジメント', '品質計画', 'レビュー', '不具合'],
    IPA_PROBLEM_LIST),

  // ───── R7 (2025年秋) ─────────────────────────────
  p(R(7), RL(7), 1, 'クラウド移行プロジェクトの計画と実行',
    ['クラウド', '移行', 'プロジェクト計画', 'コスト'],
    IPA_PROBLEM_LIST),
  p(R(7), RL(7), 2, '業務改革プロジェクトにおける要件管理',
    ['業務改革', '要件管理', '変更管理', 'ステークホルダ'],
    IPA_PROBLEM_LIST),
  p(R(7), RL(7), 3, 'システム開発プロジェクトにおける調達管理',
    ['調達管理', 'ベンダー', '契約', 'SLA'],
    IPA_PROBLEM_LIST),
]
