const puppeteer = require("puppeteer");

exports.search = async function (keyword) {
  const url = `https://www.flipkart.com/search?q=${keyword}`;
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto(url);

  const products = await page.evaluate(() =>
    Array.from(document.querySelectorAll("._2kHMtA"))
      .slice(0, 10)
      .map((product) => ({
        description: product.querySelector("._4rR01T")?.innerText,
        image: product.querySelector("._396cs4")?.src,
        price: product.querySelector("._30jeq3._1_WHN1")?.innerText,
        link: product.querySelector("a._1fQZEK")?.href,
      }))
  );
  await browser.close();

  return products;
};
