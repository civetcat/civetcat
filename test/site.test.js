import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("../", import.meta.url);

async function readPngMetadata(path) {
  const png = await readFile(new URL(path, root));

  assert.deepEqual(
    [...png.subarray(0, 8)],
    [137, 80, 78, 71, 13, 10, 26, 10],
    `${path} 必須是有效的 PNG`,
  );

  return {
    width: png.readUInt32BE(16),
    height: png.readUInt32BE(20),
    colorType: png.readUInt8(25),
  };
}

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

test("正式 Logo 與 favicon 維持透明且具有可存取名稱", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  const logoMatches = html.match(
    /src="\.\/assets\/logo-horizontal-color\.png"/g,
  );
  const logo = await readPngMetadata("assets/logo-horizontal-color.png");
  const favicon = await readPngMetadata("assets/favicon.png");

  assert.equal(logoMatches?.length, 2, "頁首與頁尾皆應使用正式橫式 Logo");
  assert.match(html, /alt="杏樹枝"/);
  assert.match(
    html,
    /rel="icon" href="\.\/assets\/favicon\.png" type="image\/png"/,
  );
  assert.equal(logo.colorType, 6, "Logo 必須保留 RGBA 透明通道");
  assert.deepEqual(
    { width: favicon.width, height: favicon.height },
    { width: 512, height: 512 },
    "favicon 必須是單一圖示的正方形裁切",
  );
  assert.equal(favicon.colorType, 6, "favicon 必須保留 RGBA 透明通道");
});
