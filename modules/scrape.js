const Scraper = require("../classes/puppeteer.class");
const Telegram = require("../classes/telegramm.class");

const scrape = async function scape(token, telegramIds, urls) {
  // initialize class
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
      console.log("run into captcha or site broke");
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
};

module.exports = scrape;
