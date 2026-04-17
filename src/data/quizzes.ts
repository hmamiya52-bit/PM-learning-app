import type { QuizQuestion } from '../types'

// ------------------------------------------------------------
// クイズ（択一）
// カテゴリはノートと共通。幅広く薄く、実装拡張前提。
// ------------------------------------------------------------

export const QUIZZES: QuizQuestion[] = [
  // ===== 統合管理 =====
  {
    id: 'q-int-001',
    category: 'integration',
    question: 'プロジェクト憲章の承認者として最も適切なのはどれか。',
    choices: [
      'プロジェクトマネージャ',
      'プロジェクトスポンサー',
      'プロジェクトチームメンバ',
      'プロジェクト管理オフィス（PMO）の事務担当',
    ],
    correctIndex: 1,
    explanation:
      'プロジェクト憲章はプロジェクトを正式に認可する文書であり、組織的な権限と資金を付与する立場であるスポンサー（またはそれに相当する上位者）が承認する。',
    difficulty: 'easy',
  },
  {
    id: 'q-int-002',
    category: 'integration',
    question: '統合変更管理プロセスで必ず実施すべき活動はどれか。',
    choices: [
      '口頭で関係者の同意を得たうえで即座に変更を反映する',
      '影響分析を行い、変更管理委員会（CCB）などで承認を得る',
      'PM個人の裁量で変更を取り込み事後報告する',
      '変更内容を一括で月末にまとめて反映する',
    ],
    correctIndex: 1,
    explanation:
      '統合変更管理では、影響分析（スコープ・コスト・スケジュール・品質・リスクへの影響）ののちにCCB等で承認を得る。口頭承認や個人裁量は避ける。',
    difficulty: 'normal',
  },

  // ===== スコープ管理 =====
  {
    id: 'q-scp-001',
    category: 'scope',
    question: 'WBSの「100％ルール」の説明として最も適切なのはどれか。',
    choices: [
      'プロジェクトの進捗が常に100％になるよう管理する',
      'プロジェクトの全作業と成果物を漏れなく、重複なく含める',
      '予算の100％を計画時点で配賦する',
      '全メンバが100％の稼働率で割り当てられる',
    ],
    correctIndex: 1,
    explanation:
      '100％ルールとは、WBSがプロジェクトの成果物・作業を漏れなく（100％）、かつ重複なく表現しなければならないという原則。',
    difficulty: 'easy',
  },
  {
    id: 'q-scp-002',
    category: 'scope',
    question: '要求事項を短期間で多数の関係者から統合的に引き出すのに最も適した技法はどれか。',
    choices: ['インタビュー', 'ワークショップ（JAD）', 'アンケート', '観察'],
    correctIndex: 1,
    explanation:
      'ファシリテータ付きワークショップ（JAD等）は関係者を集中的に集め、短期間で要求を統合的に引き出すのに有効。',
    difficulty: 'normal',
  },

  // ===== スケジュール管理 =====
  {
    id: 'q-sch-001',
    category: 'schedule',
    question: 'クリティカルパス上のアクティビティのトータルフロートはいくらか。',
    choices: ['0', '1日', 'フリーフロートと同じ値', 'アクティビティの期間と等しい'],
    correctIndex: 0,
    explanation:
      'クリティカルパスは最長経路であり、その上のアクティビティのトータルフロートは0である。遅延はそのままプロジェクト全体の遅延になる。',
    difficulty: 'easy',
  },
  {
    id: 'q-sch-002',
    category: 'schedule',
    question:
      'スケジュール短縮のためにタスクを並列化する技法で、手戻りリスクの増加に注意が必要なのはどれか。',
    choices: ['クラッシング', 'ファストトラッキング', 'リソース平準化', 'マイルストーン削減'],
    correctIndex: 1,
    explanation:
      'ファストトラッキングは本来逐次であるアクティビティを並列化する技法。手戻りやリワークのリスクが増える可能性があるため注意が必要。',
    difficulty: 'normal',
  },

  // ===== コスト管理 =====
  {
    id: 'q-cst-001',
    category: 'cost',
    question: 'EV=200、PV=250、AC=220のとき、CPIとSPIの組み合わせとして正しいものはどれか。',
    choices: [
      'CPI=0.91, SPI=0.80',
      'CPI=0.80, SPI=0.91',
      'CPI=1.10, SPI=1.25',
      'CPI=1.25, SPI=1.10',
    ],
    correctIndex: 0,
    explanation:
      'CPI = EV/AC = 200/220 ≒ 0.91（コスト超過）、SPI = EV/PV = 200/250 = 0.80（遅延）。いずれも1未満でありコスト・スケジュールとも悪化している。',
    difficulty: 'normal',
  },
  {
    id: 'q-cst-002',
    category: 'cost',
    question: '三点見積（PERT）で最も確からしい所要期間を求める式はどれか。',
    choices: [
      '(楽観 + 悲観) / 2',
      '(楽観 + 最頻 + 悲観) / 3',
      '(楽観 + 4×最頻 + 悲観) / 6',
      '(2×楽観 + 最頻 + 2×悲観) / 5',
    ],
    correctIndex: 2,
    explanation:
      'PERTのベータ分布では、期待値 = (O + 4M + P) / 6 で計算する。Mにより大きな重みを置く点が特徴。',
    difficulty: 'normal',
  },

  // ===== 品質管理 =====
  {
    id: 'q-qty-001',
    category: 'quality',
    question: 'QA（品質保証）の説明として最も適切なのはどれか。',
    choices: [
      '個々の成果物を検査して欠陥を発見する活動',
      '品質プロセスそのものが計画どおりに機能しているか監査する活動',
      '不具合の是正費用を計算する活動',
      '納入後のユーザ満足度を測る活動',
    ],
    correctIndex: 1,
    explanation:
      'QAはプロセス志向で、品質マネジメントのプロセスや標準が守られているかを確認する。成果物を直接検査するのはQC（品質コントロール）。',
    difficulty: 'easy',
  },

  // ===== 資源管理 =====
  {
    id: 'q-res-001',
    category: 'resource',
    question:
      'RACIチャートで、ひとつのタスクに対して必ず1人のみ割り当てるべき役割はどれか。',
    choices: ['R（実行責任）', 'A（説明責任）', 'C（相談）', 'I（情報共有）'],
    correctIndex: 1,
    explanation:
      'A（Accountable：説明責任）は最終的な責任者であり、混乱を避けるため必ず1人を割り当てる。Rは複数人でも可。',
    difficulty: 'easy',
  },

  // ===== コミュニケーション =====
  {
    id: 'q-com-001',
    category: 'communication',
    question: '関係者が8名のプロジェクトでのコミュニケーション経路の数はいくつか。',
    choices: ['16', '24', '28', '36'],
    correctIndex: 2,
    explanation: 'n(n-1)/2 = 8×7/2 = 28。人が増えるほど経路数は急激に増える。',
    difficulty: 'easy',
  },

  // ===== リスク管理 =====
  {
    id: 'q-rsk-001',
    category: 'risk',
    question:
      'プロジェクトで顕在化した脅威に対して、保険に加入してリスクを第三者に移転する対応はどれか。',
    choices: ['回避', '軽減', '転嫁', '受容'],
    correctIndex: 2,
    explanation:
      '保険への加入は、リスクの影響をリスク負担能力のある第三者に移す「転嫁（Transfer）」の代表例。',
    difficulty: 'easy',
  },
  {
    id: 'q-rsk-002',
    category: 'risk',
    question: '未知の未知（unknown-unknowns）への備えとして用いる予算はどれか。',
    choices: [
      'コンティンジェンシー予備',
      'マネジメント予備',
      'アクティビティ見積予備',
      'ワークパッケージ予備',
    ],
    correctIndex: 1,
    explanation:
      'マネジメント予備は未知のリスク（unknown-unknowns）に備えるもので、使用にはスポンサー等の承認が必要。コンティンジェンシー予備は既知のリスク向け。',
    difficulty: 'normal',
  },

  // ===== 調達管理 =====
  {
    id: 'q-prc-001',
    category: 'procurement',
    question:
      '仕様が十分固まっていない研究開発型の調達で、最も適した契約形態はどれか。',
    choices: ['完全固定価格（FFP）', 'コストプラス（CPFF）', 'タイム＆マテリアル（T&M）', '総価請負'],
    correctIndex: 1,
    explanation:
      '仕様が不確定な場合、発注者が実費を負担するコストプラス契約が向く。固定価格は仕様確定時に有効だが、不確定な場合は受注者のリスクが過大になる。',
    difficulty: 'normal',
  },

  // ===== ステークホルダー =====
  {
    id: 'q-stk-001',
    category: 'stakeholder',
    question:
      '権限／関心度マトリクスで「高権限×低関心」のステークホルダーに対して取るべき基本戦略はどれか。',
    choices: [
      'Manage Closely（密接に管理）',
      'Keep Satisfied（満足させ続ける）',
      'Keep Informed（情報提供）',
      'Monitor（監視）',
    ],
    correctIndex: 1,
    explanation:
      '権限は高いが関心が低い相手は、関心を上げすぎず、必要な情報提供と結果報告で「満足させ続ける」のが基本戦略。',
    difficulty: 'easy',
  },

  // ===== プロセス群 =====
  {
    id: 'q-prc-group-001',
    category: 'process',
    question:
      'プロジェクトの終結プロセス群で必ず実施すべき活動として最も適切なのはどれか。',
    choices: [
      '新規リスクの特定',
      '教訓（Lessons Learned）の取得と記録',
      '新規契約の締結',
      '要員の追加採用',
    ],
    correctIndex: 1,
    explanation:
      '終結プロセスでは教訓の整理と記録が必ず行われる。将来のプロジェクトに活用するための組織資産（OPA）となる。',
    difficulty: 'easy',
  },

  // ===== アジャイル =====
  {
    id: 'q-agl-001',
    category: 'agile',
    question: 'Scrumのロールで、プロダクトバックログの優先順位付けに責任を持つのは誰か。',
    choices: [
      'スクラムマスター',
      'プロダクトオーナー',
      '開発チーム',
      'ステークホルダー代表',
    ],
    correctIndex: 1,
    explanation:
      'プロダクトバックログの順序（優先順位）はプロダクトオーナーの責任。価値最大化の観点から判断する。',
    difficulty: 'easy',
  },
  {
    id: 'q-agl-002',
    category: 'agile',
    question:
      'ハイブリッド型アプローチの適用として最も適切な例はどれか。',
    choices: [
      '要件が不確実な機能開発にはアジャイル、インフラ構築にはウォーターフォールを適用する',
      '全フェーズで必ずアジャイルを採用する',
      'アジャイル採用時は契約形態を必ず完全固定価格にする',
      'ステークホルダーにはアジャイルであることを伝えない',
    ],
    correctIndex: 0,
    explanation:
      'ハイブリッド型は、プロジェクトの領域ごとに不確実性と要求特性を見極め、適切な開発アプローチを組み合わせる。',
    difficulty: 'normal',
  },

  // ===== 試験対策 =====
  {
    id: 'q-exm-001',
    category: 'exam',
    question:
      '午後I記述問題で得点しやすい解答として最も適切なのはどれか。',
    choices: [
      '問題文と関係のない自分の経験談を長く書く',
      '本文の語句を拾い「キーワード＋理由」で簡潔にまとめる',
      '箇条書きで単語だけ並べる',
      '一般論を多く書いてボリュームを稼ぐ',
    ],
    correctIndex: 1,
    explanation:
      '午後Iは本文根拠を踏まえたキーワード＋理由型が基本。字数制限内で主語・目的・理由を明確にする。',
    difficulty: 'easy',
  },
]
