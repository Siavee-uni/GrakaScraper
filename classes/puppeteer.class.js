const puppeteer = require("puppeteer");
const UserAgent = require("user-agents");
const fs = require("fs");
const time = require("../modules/time");
/* const scrapePids = require("../modules/bill-pids-puppeteer") */

class Scraper {
  constructor() {
    this.url = [];
    this.loglv;
  }

  setUrl(urlArray) {
    this.url = urlArray;
  }
  setLogLv(boolean) {
    this.loglv = boolean;
  }

  async getPage() {
    // get date
    if (!fs.existsSync("screenshots")) {
      fs.mkdirSync("screenshots");
    }
    // prepare for headless chrome
    const args = [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-infobars",
      "--window-position=0,0",
      "--ignore-certifcate-errors",
      "--ignore-certifcate-errors-spki-list",
    ];

    const options = {
      args,
      headless: false,
      ignoreHTTPSErrors: true,
    };
    let browser = null;
    let urls = [];

    try {
      browser = await puppeteer.launch(options);
      const page = await browser.newPage();
      // generate new user Agent
      const device = new UserAgent();
      // set user agent (override the default headless User Agent)
      await page.setUserAgent(device.toString());
      await page.setViewport({ width: 1080, height: 1080 });
      await page.setRequestInterception(true);
      await page.setDefaultNavigationTimeout(0); 
      // remove css/image/fonts
      page.on("request", (req) => {
        if (
          req.resourceType() == "stylesheet" ||
          req.resourceType() == "font" ||
          req.resourceType() == "image"
        ) {
          req.abort();
        } else {
          req.continue();
        }
      });
      for (const [key, value] of Object.entries(this.url)) {
        // check for product availability
        let captcha = null;
        if (this.loglv) {
          await page.screenshot({ path: "screenshots/log" + time.getTimeStemp("file") + ".jpeg" });
        }
        if (key === "bilshort") {
          for (let url of value) {
            await page.goto(url, { waitUntil: "domcontentloaded" });

            let name = await page.evaluate(() => {
              let el = document.querySelector(".listing .product_name");
              return el ? true : false;
            });
            let object = {
              bilshort: true,
              name: name,
              url: url.replace(/\+/g, "%2B"),
            };
            urls.push(object);
          }
        }

        if (key === "billiger") {
          for (let url of value) {
            await page.goto(url, { waitUntil: "domcontentloaded" });

            let price = await page.evaluate(() => {
              let el = document.querySelector("#product_detail_price");
              return el ? el.getAttribute("data-price-formatted") : false;
            });
            captcha = await page.evaluate(() => {
              let el = document.querySelector("#searchex_scout");
              return !el;
            });
            let billiger = {
              price: price,
              billiger: true,
              captcha: captcha,
              url: url.replace(/\+/g, "%2B"),
            };
            urls.push(billiger);
          }
        }
        if (key === "nvidia") {
          for (let url of value) {
            await page.goto(url, { waitUntil: "domcontentloaded" });

            let NVGFT080 = await page.evaluate(() => {
              let el = document.querySelector(".buy .NVGFT080");
              return el ? JSON.parse(el.innerText) : false;
            });
            let NVGFT070 = await page.evaluate(() => {
              let el = document.querySelector(".buy .NVGFT070");
              return el ? JSON.parse(el.innerText) : false;
            });
            let NVGFT060T = await page.evaluate(() => {
              let el = document.querySelector(".buy .NVGFT060T");
              return el ? JSON.parse(el.innerText) : false;
            });
            captcha = await page.evaluate(() => {
              let el = document.querySelector("#mainCont");
              return el ? false : true;
            });
      
            let nvidia = {
              billiger: false,
              NVGFT080: NVGFT080,
              NVGFT070: NVGFT070,
              NVGFT060T: NVGFT060T,
              captcha: captcha,
            };
            urls.push(nvidia);
          }
        }
      }

      return urls;

    } catch (err) {
      console.log(`Error: ${err.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}

module.exports = Scraper;
