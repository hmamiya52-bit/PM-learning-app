// ------------------------------------------------------------
// 午後I 模範解答データ
//
// 出典: IPA公式（https://www.ipa.go.jp/shiken/mondai-kaiotu/index.html）
// ※ 初期はサンプル（R7-PM1-1）のみ収録。
//   残りの問題については、ユーザーが順次追加していく運用とする。
// ※ 解答例の文言は IPA公式PDFを参照しつつ転記すること。
// ------------------------------------------------------------

import type { Afternoon1OfficialAnswer } from '../types'

export const afternoon1Answers: Afternoon1OfficialAnswer[] = [
  // ───── R7 問1（サンプル） ─────
  {
    id: 'R7-PM1-1',
    year: 'R7',
    number: 1,
    pdfUrl: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/index.html',
    // ↓ これは機能動作確認用のサンプル。IPA公式の正式な解答例と差し替えること。
    answers: [
      { s: '1', q: '(1)', a: 'クラウドへ段階的に移行することでリスクを分散するため', essay: true },
      { s: '1', q: '(2)', a: 'オンプレミスとのハイブリッド構成を前提としたため', essay: true },
      { s: '2', q: '(1)', t: 'a', a: '要員のスキル不足' },
      { s: '2', q: '(1)', t: 'b', a: 'ベンダロックイン' },
      { s: '2', q: '(2)', a: '事前にスキル研修を実施し不足時は外部要員を手配する。', essay: true },
      { s: '3', q: '(1)', a: '移行後の運用コストが想定を超過する可能性があるため', essay: true },
      { s: '3', q: '(2)', a: '運用フェーズでのコスト監視指標を定義する。', essay: true },
    ],
  },
]

/**
 * problemId から模範解答を取得
 */
export function findAnswer(problemId: string) {
  return afternoon1Answers.find((a) => a.id === problemId)
}
