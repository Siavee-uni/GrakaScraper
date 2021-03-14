const cron = require('node-cron');
const scrape = require('./modules/scrape');
const Telegram = require('./classes/telegramm.class');
const fs = require('fs');
// define data
const token = "1655902372:AAF-Tun0dNHZ2CFVyzoWUcF1-teGs6Znhrw";
const telegramIds = {
    "ich": "1691025980",
    "alex": "217864414"
};
const urls = {
    "nvidia" : "https://shop.nvidia.com/de-de/geforce/store",
    "1" : "https://www.notebooksbilliger.de/product.php/nvidia+geforce+rtx+3080+founders+edition+683301",
    "2" : "https://www.notebooksbilliger.de/nvidia+geforce+rtx+3080+founders+edition+690362"
};
let currentdate = new Date();
let datetime =
    currentdate.getDate() +
    "." +
    (currentdate.getMonth() + 1) +
    "." +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();
// start 
(async() => {
    /* const task = cron.schedule('* * * * *', run) */
    result = await scrape(token, telegramIds, urls)
    async function run() {
        try {
            result = await scrape(token, telegramIds, urls)
            console.log("scraping succesfull " + datetime)
            /* task.stop(); */
        } catch (error) {
            /* task.stop(); */
            // write error to log
            var logStream = fs.createWriteStream('log.txt', { flags: 'a' });
            // use {flags: 'a'} to append and {flags: 'w'} to erase and write a new file
            logStream.write(JSON.stringify(error) + '\n');
            logStream.end();

            console.log(error);
        }
    }
})();