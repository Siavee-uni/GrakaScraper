const puppeteer = require("puppeteer");
const UserAgent = require("user-agents");
const fs = require("fs");
const Agent = new UserAgent();

class Scraper {
    constructor() {
        this.url = {};
    }

    setUrl(urlObject) {
        this.url = urlObject;
    }
    async getPage() {
        // create date
        let currentdate = new Date();
        let datetime =
            currentdate.getDate() +
            "." +
            (currentdate.getMonth() + 1) +
            "." +
            currentdate.getHours() +
            "." +
            currentdate.getMinutes() +
            "." +
            currentdate.getSeconds();

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
            slowMo: 250,
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

            for (const [key, value] of Object.entries(this.url)) {
                // check for product awailability
                let captcha = null;
                let NVGFT080 = null;
                let NVGFT070 = null;
                let NVGFT060T = null;
                if (key === "nvidia") {
                    await page.goto(value);
                    let NVGFT080 = await page.evaluate(() => {
                        let el = JSON.parse(document.querySelector(".buy .NVGFT080").innerText);
                        return el ? el : false;
        
                    });
                    let NVGFT070 = await page.evaluate(() => {
                        let el = JSON.parse(document.querySelector(".buy .NVGFT070").innerText);
                        return el ? el : false;
        
                    });
                    let NVGFT060T = await page.evaluate(() => {
                        let el = JSON.parse(document.querySelector(".buy .NVGFT060T").innerText);
                        return el ? el : false;
        
                    });
                        captcha = await page.evaluate(() => {
                        let el = document.querySelector("#mainCont");
                        return el ? false : true;
                    });
                    let object = {
                        "NVGFT080": NVGFT080,
                        "NVGFT070": NVGFT070,
                        "NVGFT060T": NVGFT060T,
                        "captcha": captcha,
                    }
                    urls.push(object);
                } else {
                    await page.goto(value);

                    let price = await page.evaluate(() => {
                        let el = document.querySelector("#product_detail_price");
                        return el ? el.getAttribute('data-price-formatted').value : false;
        
                    });
                        captcha = await page.evaluate(() => {
                        let el = document.querySelector("#searchex_scout");
                        return el ? false : true;
                    });
                    let object = {
                        "price": price,
                        "noneOb": true,
                        "captcha": captcha,
                        "url" : value
                    }
                    urls.push(object);
                }
                if (captcha) {
                    await page.screenshot({ path: "screenshots/catpcha" + datetime + ".jpeg" })
                }
            }
        } catch (err) {
            console.log(`Error: ${err.message}`);
        } finally {
            if (browser) {
                await browser.close();
            }
            return urls;
        }
    }
}

module.exports = Scraper;