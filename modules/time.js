const fs = require("fs");

function getTimeStemp (input) {
    let currentDate = new Date();
    let datetime;
    if (input == "file") {
        return datetime =
            currentDate.getDate() +
            "." +
            (currentDate.getMonth() + 1) +
            ".time" +
            currentDate.getHours() +
            "." +
            currentDate.getMinutes() +
            "." +
            currentDate.getSeconds() + "." +
            currentDate.getMilliseconds();
    }
    if (input == "console") {
        return datetime =
            "date: " +
            currentDate.getDate() +
            "." +
            (currentDate.getMonth() + 1) +
            ". time: " +
            currentDate.getHours() +
            ":" +
            currentDate.getMinutes() +
            ":" +
            currentDate.getSeconds();
    }
}

exports.getTimeStemp = getTimeStemp;