const puppeteer = require("puppeteer");

async function search(query) {
  const url = `https://www.amazon.in/s?k=${query}`;
  console.log(url);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  // Get product details
  const products = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".s-result-item"))
      .slice(2, 12)
      .map((product) => {
        const linkElement = product.querySelector("a.a-link-normal");
        return {
          image: product.querySelector(".s-image")?.src,
          price: product.querySelector(".a-offscreen")?.innerText,
          description: product.querySelector(".a-text-normal")?.innerText,
          link: linkElement ? `https://www.amazon.in${linkElement.getAttribute('href')}` : null,
        }
      })
  );

  await browser.close();

  return products;
}

module.exports = { search };
