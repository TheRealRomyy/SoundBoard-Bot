const Command = require("../Commands");
const NekosLife = require("nekos.life")
const neko = new NekosLife()

module.exports = class Waifu extends Command {

    constructor(client) {
        super(client, {
            name: "waifu",
            aliases: [],
            enabled: true,
            userPerms: [],
            restriction: [],
            slashCommandOptions: {
                description: "Kaizoku oni ore wa naru ! (aucun rapport)"
            }
        })
    }

    async run(message, args) {

        const img = await neko.waifu();
        await message.reply("Roaar " + img.url);
    }
}