const Command = require("../Commands");
const { codeBlock } = require("discord.js");
const { exec } = require("child_process");

module.exports = class Execute extends Command {

    constructor(client) {
        super(client, {
            name: "execute",
            aliases: ["exec"],
            enabled: true,
            userPerms: [],
            restriction: ["OWNER"],
            slashCommandOptions: {
                description: "(Romy) executer des instructions ssh"
            }
        })
    }

    async run(message, args) {

        // Introducing constants
        const client = this.client;
        const emojis = client.emojiList;
        var msg = null;

        // Check if there is args
        const content = args.join(" ");
        if(!content) return message.reply(`${emojis.error} Usage: \`${client.cfg.prefix}exec <content>\``);

        await exec(content, async (error, data, getter) => {

            if(!data) return message.reply({
                content: codeBlock("js", "> No result !")
            });

            if(error) return message.reply({
                content: codeBlock("js", error)
            });

            if(getter.length >= 2000 || data.length >= 2000) return message.reply(`${emojis.error} Trop grand mon chleb`);
            if(getter) return message.reply({
                content: codeBlock("js", getter)
            }).then(m => msg.delete().catch(() => {}));

            message.reply({
                content: codeBlock("js", data)
            }).then(m => {
               if(msg) msg.delete().catch(() => {}); 
            });
        });
    }
}