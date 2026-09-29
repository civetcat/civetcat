import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("../", import.meta.url);

test("商品資料包含展示所需欄位與有效圖片", async () => {
  const source = await readFile(new URL("data/products.json", root), "utf8");
  const products = JSON.parse(source);

  assert.ok(products.length > 0, "至少需要一項商品");

  for (const product of products) {
    assert.equal(typeof product.name, "string");
    assert.ok(product.name.trim().length > 0, "品名不可為空");
    assert.equal(typeof product.price, "number");
    assert.ok(product.price >= 0, "價格不可為負數");
    assert.equal(typeof product.imageAlt, "string");
    assert.ok(product.imageAlt.trim().length > 0, "商品圖片需提供替代文字");

    const imagePath = product.image.replace(/^\.\//, "");
    await access(new URL(imagePath, root));
  }
});

test("首頁具備主要地標與商品容器", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");

  assert.match(html, /<html lang="zh-Hant">/);
  assert.match(html, /<main>/);
  assert.match(html, /id="products"/);
  assert.match(html, /id="product-grid"/);
  assert.match(html, /class="skip-link"/);
});
