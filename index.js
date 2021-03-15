const cron = require('node-cron');
const scrape = require('./modules/scrape');
const fs = require('fs');
// define data
const token = "1698301740:AAFmBg32oYWvwG-Cu-2vG86ISlUbfxxb3Nc";
const telegramIds = {
    "ich": "1691025980",
    "alex": "217864414"
};
const urls = {
    "nvidia" : "https://shop.nvidia.com/de-de/geforce/store",
    "1" : "https://www.notebooksbilliger.de/product.php/nvidia+geforce+rtx+3080+founders+edition+683301",
    "2" : "https://www.notebooksbilliger.de/nvidia+geforce+rtx+3080+founders+edition+690362",
    "3" : "https://www.notebooksbilliger.de/nvidia+geforce+rtx+3080+founders+edition+700586"
};

let currentdate = new Date();
let datetime =
"date: " +
currentdate.getDate() +
"." +
(currentdate.getMonth() + 1) +
". time: " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();
// start 
(async() => {
    const task = cron.schedule('* * * * *', run)
    async function run() {
        try {
            console.time('scraping took');
            result = await scrape(token, telegramIds, urls)
            console.timeEnd('scraping took');
            console.log("scraping succesfull "+ datetime)
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