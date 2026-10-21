# 中川育謙 Portfolio

PDF「portfolio_20261015.pdf」（2026年10月15日版）をもとに制作した、日本語の静的ポートフォリオサイトです。Node.jsのインストールやビルド処理は不要です。

## ファイル構成

```text
portfolio/
├── index.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   ├── favicon.svg
│   └── images/          # PDFから抽出したWebP画像・OGP画像
├── docs/content-source.txt  # PDF本文の抽出記録
├── .github/workflows/pages.yml
├── .gitignore
├── .nojekyll
└── README.md
```

## 表示する

`index.html` をブラウザで開いてください。CSS・JS・画像は相対パスで参照しているため、GitHub Pagesのサブディレクトリでも表示できます。外部ライブラリやWebフォント、API、解析タグ、問い合わせフォームへの依存はありません。

スマートフォン用メニュー、案件へのページ内移動、追加画像の開閉、画像の別タブ拡大に対応しています。JavaScriptが無効でも本文・実績・追加画像は閲覧できます。印刷時は本文を中心に表示します。

## GitHub Pagesに公開する

1. GitHub上に公開リポジトリを作成します。
2. **このフォルダ内のファイル・隠しフォルダを、リポジトリのルートに配置**します。ZIPをそのまま置くのではなく展開した内容を配置してください。
3. デフォルトブランチを `main` とし、ファイルをpushします。
4. リポジトリの Settings → Pages → Build and deployment → Source を **GitHub Actions** に設定します。
5. Actionsの「Deploy portfolio to Pages」を実行、またはmainへpushします。完了後、Pagesに公開URLが表示されます。

同梱ワークフローはmainへのpush／手動実行に対応します。他のブランチを使用する場合は `pages.yml` の `branches` を変更してください。公開に伴うGitHubへのpushはこの納品では実行していません。

## 公開URLが決まったら（SEO・OGP）

title、description、lang、viewport、OGPタイトル・説明・1200×630画像、Twitter Cardは設定済みです。**正規の公開URLが未指定のためcanonicalとog:urlは未設定、og:imageはローカル確認用の相対パスです。SNSで確実に画像を表示するには、公開URLが決まった後に次を設定してください。**

たとえば公開先が `https://ACCOUNT.github.io/REPOSITORY/` の場合、index.htmlのheadに以下を追加し、既存のog:imageを置き換えます。ACCOUNTとREPOSITORYは実際の値に変更します。

```html
<link rel="canonical" href="https://ACCOUNT.github.io/REPOSITORY/">
<meta property="og:url" content="https://ACCOUNT.github.io/REPOSITORY/">
<meta property="og:image" content="https://ACCOUNT.github.io/REPOSITORY/assets/images/ogp.jpg">
<meta name="twitter:image" content="https://ACCOUNT.github.io/REPOSITORY/assets/images/ogp.jpg">
```

公開後は実URLで画像が開くことと、各SNSのリンクプレビューを確認してください。公開先を捏造しないためsitemap.xml・URL入り構造化データは同梱していません。単一ページのサイトとして検索エンジンが巡回できる通常のHTMLです。

## 内容と更新方法

- PDFの順序に沿って、自己紹介 → 実績サマリー → スキル → 8案件 → 貢献できることを掲載。
- ロフト・楽天・朝日新聞社・トイカードは実案件、現場のミカタ・ヘアサロン・LUMÉA・FLEURIAは自主制作として区別。
- スキルの5段階評価は原文を維持。数値実績を追加・推定していません。
- PDFの説明文はWeb向けに段落整理・表記調整しています。原文は `docs/content-source.txt` で確認できます。
- 内容は `index.html`、配色・レイアウトは `assets/css/style.css`、メニュー動作は `assets/js/main.js` を編集します。
- PDF内の既存サイトURLと自主制作URLを掲載しています。リンク先の現時点の内容・稼働はこの納品の検証範囲に含みません。
- 連絡先はPDFに記載がないため追加していません。

## 画像・権利

画像は提供PDFから抽出した制作画面です。企業ロゴ・商品画像・人物写真などの権利は各権利者に帰属します。このリポジトリは、それらの第三者素材の再配布・二次利用を許諾するものではありません。PDF自体は同梱していません。

## 表示・アクセシビリティ

セマンティックな見出し、代替テキスト、スキップリンク、フォーカス表示、キーボード操作、Escapeでのメニュー終了、動きを減らす設定に対応。画像サイズ指定・遅延読み込み・WebPで読み込み負荷を抑えています。
