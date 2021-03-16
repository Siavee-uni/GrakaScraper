const puppeteer = require("puppeteer");

async function scrapePids (url, page) {
    await page.goto(url, { waitUntil: "domcontentloaded" });

    let name = await page.evaluate(() => {
      let el = document.querySelector(".listing .product_name");
      return el ? true : false;
    });
    return object = {
      "bilshort": true,
      "name": name,
      "url": url.replace(/\+/g, "%2B"),
    };
}

exports.scrapePids = scrapePids;