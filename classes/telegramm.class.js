class telegram {

    constructor(token) {
        this.token = token;
        this.chatID; // object
    }
    setMessage(msg) {
        this.msg = msg;
    }
    setIds(ids) {
        this.chatID = ids;
    }
    sendMessage() {
        for (const [key, value] of Object.entries(this.chatID)) {
            let link1 = "https://api.telegram.org/bot" + this.token;
            console.log()
            let url = link1 + "/sendMessage?chat_id=" + value + "&text=" + this.msg;

            const https = require('https')
            https.get(encodeURI(url), (resp) => {
                let data = resp;
                return data;
            });

        }

    }

}

module.exports = telegram;