// ------------------------------------------------------------
// PM試験 午後I 問題メタデータ（R3〜R7）
//
// 出典: IPA公式（https://www.ipa.go.jp/shiken/mondai-kaiotu/index.html）
// ※ 問題本文・解答例は著作権の関係でアプリ内に全文は載せず、
//   IPA公式PDFへのリンクで提供する。
// ※ 午後Iの問題冊子PDFは3問まとめて1ファイル、解答例PDFも3問分が1ファイル。
// ------------------------------------------------------------

import type { Afternoon1Problem } from '../types'

const RL = (y: number) => `R${y}（${y + 2018}年）`
const R = (y: number) => `R${y}`

// IPA公式 年度別 PDF ベースURL（秋期試験）
const IPA = {
  R3: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/gmcbt8000000apad-att/2021r03a_pm',
  R4: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/gmcbt80000008smf-att/2022r04a_pm',
  R5: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/ps6vr70000010d6y-att/2023r05a_pm',
  R6: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/m42obm000000afqx-att/2024r06a_pm',
  R7: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/nl10bi0000009lh8-att/2025r07a_pm',
}

const pm1Qs = (base: string) => `${base}_pm1_qs.pdf`
const pm1Ans = (base: string) => `${base}_pm1_ans.pdf`

function p(
  year: string,
  yearLabel: string,
  number: 1 | 2 | 3,
  title: string,
  keywords: string[],
  yearKey: keyof typeof IPA
): Afternoon1Problem {
  return {
    id: `${year}-PM1-${number}`,
    year,
    yearLabel,
    number,
    title,
    keywords,
    questionPdfUrl: pm1Qs(IPA[yearKey]),
    answerPdfUrl: pm1Ans(IPA[yearKey]),
  }
}

export const afternoon1Problems: Afternoon1Problem[] = [
  // ───── R3 (2021年秋) ─────────────────────────────
  p(R(3), RL(3), 1, '新たな事業を実現するためのシステム開発プロジェクト',
    ['新規事業', 'DX', '要員確保', 'プロジェクト計画'], 'R3'),
  p(R(3), RL(3), 2, '業務管理システムの改善のためのシステム開発プロジェクト',
    ['業務改善', '顧客満足', '共通目標', 'ステークホルダ'], 'R3'),
  p(R(3), RL(3), 3, 'マルチベンダのシステム開発プロジェクト',
    ['マルチベンダ', '調達', 'ベンダー管理', '立ち上げ'], 'R3'),

  // ───── R4 (2022年秋) ─────────────────────────────
  p(R(4), RL(4), 1, 'SaaSを利用して短期間にシステムを導入するプロジェクト',
    ['SaaS', '短期導入', 'Fit&Gap', '要件定義'], 'R4'),
  p(R(4), RL(4), 2, 'ECサイト刷新プロジェクトにおけるプロジェクト計画',
    ['EC', '刷新', 'プロジェクト計画', '要員計画'], 'R4'),
  p(R(4), RL(4), 3, 'プロジェクトにおけるチームビルディング',
    ['チームビルディング', '要員', 'モチベーション', 'コミュニケーション'], 'R4'),

  // ───── R5 (2023年秋) ─────────────────────────────
  p(R(5), RL(5), 1, '価値の共創を目指すプロジェクトチームのマネジメント',
    ['共創', 'チームマネジメント', '適応型', 'アジャイル'], 'R5'),
  p(R(5), RL(5), 2, 'システム開発プロジェクトにおけるイコールパートナーシップ',
    ['協力会社', 'パートナーシップ', 'ベンダー関係', '調達'], 'R5'),
  p(R(5), RL(5), 3, '化学品製造業における予兆検知システム',
    ['予兆検知', 'IoT', 'ステークホルダ', '要件定義'], 'R5'),

  // ───── R6 (2024年秋) ─────────────────────────────
  p(R(6), RL(6), 1, '顧客体験価値を提供するシステム開発プロジェクト',
    ['CX', '顧客価値', '適応型', 'ステークホルダ'], 'R6'),
  p(R(6), RL(6), 2, 'プロジェクトマネジメントの計画',
    ['PM計画', '計画立案', 'ベースライン'], 'R6'),
  p(R(6), RL(6), 3, 'プロジェクト計画の修整（テーラリング）',
    ['テーラリング', '修整', 'プロジェクト計画'], 'R6'),

  // ───── R7 (2025年秋) ─────────────────────────────
  p(R(7), RL(7), 1, '生成AIを活用したシステムの開発・導入・運用・保守を行うプロジェクトの計画立案',
    ['生成AI', '計画立案', '運用保守', 'ライフサイクル'], 'R7'),
  p(R(7), RL(7), 2, '製薬会社におけるCRM刷新プロジェクト',
    ['製薬', 'CRM', '刷新', '要件管理'], 'R7'),
  p(R(7), RL(7), 3, 'プロジェクト実施中の計画変更',
    ['計画変更', '変更管理', '統合管理'], 'R7'),
]
