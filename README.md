# 家計簿（budget-book）

ブラウザだけで使えるシンプルな家計簿アプリです。収入・支出を記録し、月ごとの合計と明細を確認できます。データは **端末のブラウザ（localStorage）** に保存されます。

**リポジトリ:** [github.com/tsukky101/budget](https://github.com/tsukky101/budget)

## 機能

- 収入 / 支出の登録（日付・カテゴリ・金額・メモ）
- 表示月の切り替え
- 月次サマリー（収入合計・支出合計・収支）
- 明細一覧・削除
- ダークテーマの UI

## 技術スタック

- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) 6

## 必要な環境

- [Node.js](https://nodejs.org/)（推奨: 最新 LTS）
- [Yarn](https://yarnpkg.com/) 1.x（Classic）

> 同梱の `npm` でエラーになる場合は、このプロジェクトでは **Yarn** の利用を想定しています。

## ローカルで動かす

```bash
cd "budget book"   # クローンしたディレクトリへ
yarn install
yarn dev
```

ブラウザで表示された URL（例: `http://localhost:5173`）を開きます。

## ビルド

```bash
yarn build
yarn preview   # ビルド結果のプレビュー
```

### GitHub Pages 用ビルド

プロジェクトサイト（`/budget/`）向けにビルドする場合:

```bash
# PowerShell
$env:GITHUB_PAGES="true"; yarn build

# bash
GITHUB_PAGES=true yarn build
```

## GitHub Pages

`main` ブランチへの push で [GitHub Actions](.github/workflows/pages.yml) が `dist` をデプロイします。

1. リポジトリの **Settings → Pages**
2. **Build and deployment** の **Source** で **GitHub Actions** を選択

公開 URL の例: `https://tsukky101.github.io/budget/`

## ライセンス

このリポジトリのライセンスは未設定です。利用・配布の条件を決める場合は `LICENSE` を追加してください。
