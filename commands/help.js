const Command = require("../Commands");
const { EmbedBuilder } = require("discord.js");

module.exports = class Help extends Command {

    constructor(client) {
        super(client, {
            name: "help",
            aliases: ["h", "aide", "oskour", "soundboard", "soundboards", "sb"],
            enabled: true,
            userPerms: [],
            restriction: [],
            slashCommandOptions: {
                description: "OSKOUR ! C KOI LES SOUNDBOARDS ?"
            }
        })
    }

    async run(message, args) {

        const client = this.client;

        const embed = new EmbedBuilder()
        .setTitle(`Page d'aide de ${client.user.username}`)
        .setFooter({"text":"By Romyy"})
        .addFields({name:`🎵・Soundboards (${client.sics.size})`, value: Array.from(client.sics).map(cmd => "\`" + cmd[0] + "\`").join(", "), inline:false})
        .addFields({name:`⚙️・Commands (${client.cmds.size})`, value: Array.from(client.cmds).map(cmd => "\`" + cmd[0] + "\`").join(", "), inline:false})
        .setColor(0x0099FF)

        message.reply({ 
            embeds: [embed] 
        });
    }
}