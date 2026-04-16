# プロジェクトマネージャへの道

**PM Project Manager Learning App by MAMIYA**

IPA「プロジェクトマネージャ試験」の**午後問題演習**に特化した学習アプリ。

## 概要

- **午後I**（記述式）: 過去問演習 + 自己採点
- **午後II**（論述式）: 論文執筆トレーニング + ネタ帳
- **ノート**: PMBOK等の知識整理
- **クイズ**: 用語・フレームワーク確認
- **進捗管理**: スコア履歴・学習計画

対象年度: R3〜R7（直近5年分）

## 技術スタック

- React 19 + TypeScript + Vite
- TailwindCSS
- React Router v7
- PWA (vite-plugin-pwa)
- localStorage でデータ永続化

## 開発

```bash
npm install --legacy-peer-deps
npm run dev     # 開発サーバー（http://localhost:5173）
npm run build   # 本番ビルド
npm run preview # ビルド結果をローカル確認
```

## 実装ロードマップ

| Phase | 内容 |
|-------|------|
| Phase 0 | プロジェクト初期化 + トップページ（完了） |
| Phase 1 | 午後I 演習 |
| Phase 2 | ノート + クイズ |
| Phase 3 | 進捗トラッカー |
| Phase 4 | 午後II 論述トレーニング + ネタ帳 |

## テーマ

- カラー: 濃い赤紫（`#7B2D5F`）
- デザイントーン: ダークサイドバー + ライトメイン（NWSP流用）
