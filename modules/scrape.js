const Scraper = require("../classes/puppeteer.class");
const Telegram = require("../classes/telegramm.class");

const scrape = async function scape(token, telegramIds, urls) {
  console.time('scraping-took');
  // initialize class
  let scraper = new Scraper();
  scraper.setUrl(urls);
  // set true for screenshots
  scraper.setLogLv(true);
  let telegram = new Telegram(token);
  telegram.setIds(telegramIds);
  // get page content
  let results = await scraper.getPage();
  // send message
  if (!Array.isArray(results)) {
    console.log("puppeteer failed to scrape pages")
    return;
  }

  for (let result of results) {
    // check for amazon captcha
    if (result.captcha) {
      console.log("run into captcha or site could not load");
    }
    // check for billger
    if (result.billiger) {
      if (result.price) {
        console.log("verfügbar" + result.url + " für " + result.price);
        telegram.setMessage(
          result.url + " ist für " + result.price + " verfügbar"
        );
        telegram.sendMessage();
      }
      continue;
    }
    if (result.bilshort) {
      if (result.name) {
        console.log("verfügbar " + result.url);
        telegram.setMessage(
          result.url + " ist verfügbar!!! kaufen!!!!"
        );
        telegram.sendMessage();
      }
      continue;
    }
    // check for nvidia
    for (const value of Object.values(result)){
      try {
        if (value[0].stock > 0 || value[0].hasOffer) {
          console.log(
            "verfügbar " +
              value[0].directPurchaseLink +
              " für " +
              value[0].salePrice
          );
          telegram.setMessage(
            result.url +
              " ist für " +
              result.price +
              " verfügbar direkt link: " +
              value[0].directPurchaseLink
          );
          telegram.sendMessage();
        }
      } catch (e) {}
    }
  }
  console.timeEnd('scraping-took');
};

module.exports = scrape;
