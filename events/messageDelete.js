module.exports = class MessageDelete {

    constructor(client) {
        this.client = client;
    }

    async run(message) {

        const client = this.client;

        // Verify that user is not a bot and that there is a guild
        if(message.author.bot || !message.guild) return;

        const snipe = {
            user: message.author,
            text: message.content,
            date: Date.now()
        };

        client.snipe.set(message.channel.id, snipe);
    }
}