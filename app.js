const grid = document.querySelector("#product-grid");
const year = document.querySelector("#current-year");
const currency = new Intl.NumberFormat("zh-TW", {
  style: "currency",
  currency: "TWD",
  maximumFractionDigits: 0,
});

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const imageWrap = document.createElement("div");
  imageWrap.className = "product-image-wrap";

  const image = document.createElement("img");
  image.className = "product-image";
  image.src = product.image;
  image.alt = product.imageAlt;
  image.width = 800;
  image.height = 600;
  image.loading = "lazy";
  image.decoding = "async";

  const info = document.createElement("div");
  info.className = "product-info";

  const name = document.createElement("h3");
  name.className = "product-name";
  name.textContent = product.name;

  const price = document.createElement("p");
  price.className = "product-price";
  price.textContent = currency.format(product.price);

  imageWrap.append(image);
  info.append(name, price);
  card.append(imageWrap, info);

  return card;
}

async function renderProducts() {
  try {
    const response = await fetch("./data/products.json");
    if (!response.ok) {
      throw new Error(`商品資料載入失敗：${response.status}`);
    }

    const products = await response.json();
    const cards = products.map(createProductCard);
    grid.replaceChildren(...cards);
  } catch (error) {
    console.error(error);
    const message = document.createElement("p");
    message.className = "error-message";
    message.textContent = "商品資料暫時無法載入，請稍後再試。";
    grid.replaceChildren(message);
  }
}

year.textContent = new Date().getFullYear();
renderProducts();
