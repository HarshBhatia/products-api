const puppeteer = require("puppeteer");

exports.search = async function (keyword) {
  const url = `https://www.croma.com/searchB?q=${keyword}%3Arelevance&text=${keyword}`;
  const browser = await puppeteer.launch({ headless: true });

  const page = await browser.newPage();

  // Grants permission for changing geolocation
  const context = browser.defaultBrowserContext();
  await context.overridePermissions(url, ["geolocation"]);
  // Grants permission for changing geolocation
  await page.evaluateOnNewDocument(function () {
    navigator.geolocation.getCurrentPosition = function (cb) {
      setTimeout(() => {
        cb({
          coords: {
            accuracy: 21,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            latitude: 28.70406,
            longitude: 77.102493,
            speed: null,
          },
        });
      }, 1000);
    };
  });

  await page.goto(url);

  await delay(4000);
  const products = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".product-item"))
      .slice(0, 10)
      .map((product) => ({
        description: product.querySelector(".product-title")?.innerText,
        image: product.querySelector(
          ".product-img.plp-card-thumbnail > a > img"
        )?.src,
        price: product.querySelector(".amount")?.innerText,
        link: product.querySelector(".product-title a")?.href,
      }))
  );
  await browser.close();
  console.log(products);
  return products;
};

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
