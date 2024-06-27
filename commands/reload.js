const Command = require("../Commands");
const { exec } = require("child_process");

module.exports = class Reload extends Command {

    constructor(client) {
        super(client, {
            name: "reload",
            aliases: ["rl"],
            enabled: true,
            userPerms: [],
            restriction: ["OWNER"],
            slashCommandOptions: {
                description: "(Romy) relancer le bot avec les dernieres maj"
            }
        })
    }

    async run(message, args) {

        // Introducing constants
        const client = this.client;
        const emojis = client.emojiList;

        message.reply(`${emojis.success} | Ca marche, jm'e relance...`);

        await exec("git pull soundboard master");
        await exec("pm2 restart Soundboard");
    }
}