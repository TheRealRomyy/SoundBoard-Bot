const Command = require("../Commands");
const { codeBlock } = require("discord.js");

module.exports = class Evaluate extends Command {

    constructor(client) {
        super(client, {
            name: "evaluate",
            aliases: ["eval"],
            enabled: true,
            userPerms: [],
            restriction: ["OWNER"],
            slashCommandOptions: {
                description: "(Romy) executer du code javascript"
            }
        })
    }

    async run(message, args) {

        // Introducing constants
        const client = this.client;
        const emojis = client.emojiList;

        // Check if there is args
        const content = args.join(" ");
        if(!content) return message.reply(`${emojis.error} Usage: \`${client.cfg.prefix}eval <content>\``);

        // Resolve js code
        const result = new Promise((resolve, reject) => resolve(eval(content)));
        return result.then(async (output) => {
            if(typeof output !== "string") output = require("util").inspect(output, { depth: 0 });

            if(output.length >= 2000) return message.reply(`${emojis.error} Trop grand mon chleb`);
    
            message.channel.send({
                content: codeBlock("js", output)
            });
        }).catch((err) => {
            err = err.toString();
            message.channel.send({
                content: codeBlock("js", err)
            });
        });
    }
}