module.exports = class Ready {

    constructor(client) {
        this.client = client;
    }

    async run() {
        console.log("Bot on !")
    }
}