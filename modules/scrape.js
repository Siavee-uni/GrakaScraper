const Scraper = require("../classes/puppeteer.class");
const Telegram = require("../classes/telegramm.class");

const scrape = async function scape(token, telegramIds, urls) {
  // inicialice class
  let scraper = new Scraper();
  scraper.setUrl(urls);
  let telegram = new Telegram(token);
  telegram.setIds(telegramIds);
  // get page content
  let results = await scraper.getPage();
  // send message
  for (let result of results) {
    // check for amazon captcha
    if (result.captcha) {
      continue;
    }
    console.log(result)
    if (!result.noneOb) { 
        if (result.price) { 
            console.log("verfügbar" + result.url + " für " + result.price)
            telegram.setMessage(result.url + " ist für " + result.price + " verfügbar");
            telegram.sendMessage();
        }
        continue;
    }
    for (let [key, value] of Object.entries(result)) { 
      try {
        if (isAvailable){
            console.log("verfügbar" + purchaseLink + " für " + salePrice)
            telegram.setMessage(result.url + " ist für " + result.price + " verfügbar");
            telegram.sendMessage();
        }
      } catch (e) {}
    }
  }
  return false;
};

module.exports = scrape;
