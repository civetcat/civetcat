# 杏樹枝商品展示網站

零依賴的響應式靜態網站，展示商品圖片、品名與價格，不含購物車或訂購功能。

## 本機預覽

需要 Node.js 18+ 與 Python 3。

```bash
npm test
npm run serve
```

開啟 <http://localhost:4173>。

## 更新商品

1. 將商品圖片放入 `assets/`。
2. 編輯 `data/products.json` 中的品名、價格、圖片路徑與替代文字。
3. 執行 `npm test` 確認資料與圖片路徑有效。

目前的商品與 SVG 圖片皆為可替換的示意內容。

## Cloudflare Pages 部署

連結 Git repository 後使用以下設定：

- Framework preset：None
- Build command：留空
- Build output directory：`/`

網站只有靜態 HTML、CSS、JavaScript 與圖片，不需要 Pages Functions、Workers 或環境變數。

> Repo 內原有的 Kotlin 教學 Markdown 文件為歷史內容，未納入網站頁面。
