const Command = require("../Commands");
const NekosLife = require("nekos.life")
const neko = new NekosLife()

module.exports = class Neko extends Command {

    constructor(client) {
        super(client, {
            name: "neko",
            aliases: [],
            enabled: true,
            userPerms: [],
            restriction: [],
            slashCommandOptions: {
                description: "Kaizoku oni ore wa naru ! (aucun rapport)",
                options: [
                    {
                        type: "string",
                        required: true,
                        description: "neko image type",
                        name: "type",
                        choices: [
                            { name: "Waifuu 💅", value: "waifu"},
                            { name: "Slapp 🖐️", value: "slap"},
                            { name: "Smug 🏆", value: "smug"},
                            { name: "Baka", value: "baka"},
                            { name: "🤗 Cuddle", value: "cuddle"},
                            { name: "🦊 Foxgirl", value: "foxGirl"},
                            { name: "🦎 Lizard", value: "lizard"},
                            { name: "Pat", value: "pat"},
                            { name: "😺 Cat", value: "meow"}
                        ]
                    }
                ]
            }
        })
    }

    async run(message, args) {
        const img = await neko["waifu"]();
        await message.reply("Roaar " + img.url);
    }

    async runInteraction(interaction) {
        const type = interaction.options.getString("type");
        const img = await neko[type]();
        await interaction.reply(`[${type}] => ${img.url}`);
    }
}