const cron = require("node-cron");
const scrape = require("./modules/scrape");
const fs = require("fs");
const time = require("./modules/time");
// define data
const token = "1698301740:AAFmBg32oYWvwG-Cu-2vG86ISlUbfxxb3Nc";
const telegramIds = {
  ich: "1691025980",
  alex: "217864414",
  hendrik: "1690666319",
  denis: "1757821955",
};
const urls = {
  nvidia: ["https://shop.nvidia.com/de-de/geforce/store"],
  billiger: [
    "https://www.notebooksbilliger.de/product.php/nvidia+geforce+rtx+3080+founders+edition+683301",
    "https://www.notebooksbilliger.de/nvidia+geforce+rtx+3080+founders+edition+690362",
    "https://www.notebooksbilliger.de/nvidia+geforce+rtx+3080+founders+edition+700586",
  ],
  bilshort: [
    "https://www.notebooksbilliger.de/extensions/ntbde/getsearchlisting.php?pids=683301",
    "https://www.notebooksbilliger.de/extensions/ntbde/getsearchlisting.php?pids=690362",
    "https://www.notebooksbilliger.de/extensions/ntbde/getsearchlisting.php?pids=700586",
  ],
};
// start
let task = false;

cron.schedule("* * * * *", async () => {
  if (task) {
    console.log("task took longer then 1min. Skipping task");
    return;
  }
  task = true;
  try {
    result = await scrape(token, telegramIds, urls);
    console.log("scraping succesfull " + time.getTimeStemp("console"));
    task = false;
  } catch (error) {
    var logStream = fs.createWriteStream("log.txt", { flags: "a" });
    // use {flags: 'a'} to append and {flags: 'w'} to erase and write a new file
    logStream.write(JSON.stringify(error) + "\n");
    logStream.end();
    console.log(error);
  }
});
