const Command = require("../Commands");
const { EmbedBuilder } = require("discord.js");

module.exports = class Snipe extends Command {

    constructor(client) {
        super(client, {
            name: "snipe",
            aliases: [],
            enabled: true,
            userPerms: [],
            restriction: [],
            slashCommandOptions: {
                description: "T'AS DIS QUOI MON FRERE !?"
            }
        })
    }

    async run(message, args) {
        const client = this.client;
        
        const snipe = client.snipe.get(message.channel.id);
        if(!snipe) return message.reply(`${client.emojiList.error} \`J'ai pas la ref la :/\``);

        const embed = new EmbedBuilder()
        .setFooter({text:"Snipe | Soundboard - Bot"})
        .setColor("#2f3136")
        .setAuthor({name: snipe.user.username, iconURL: snipe.user.displayAvatarURL({ dynamic:true })})
        .setDescription(snipe.text.length > 0 ? snipe.text : `${client.emojiList.dnd} Y'a pas de texte`)
        .setTimestamp(snipe.date);

        return message.reply({
            embeds: [embed]
        });
    }
}