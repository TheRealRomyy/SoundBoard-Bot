const { EmbedBuilder } = require("discord.js");

module.exports = class Error {

    constructor(client) {
        this.client = client;
    }

    async run(error) {
        // Introducing constants
        const client = this.client;
        const channel = client.guilds.cache.get(client.cfg.mainGuildIdea).channels.cache.get("1255826808490819624");

        const embed = new EmbedBuilder()
        .setFooter({text:`Y'avait pas eu de couilles depuis \`${client.lastError ? client.functions.convertMS(client.lastError - Date.now()) : "jamais"}\``})
        .setColor("DarkRed")
        .setAuthor({name:"New error detected:", value:client.user ? client.user.displayAvatarURL({dynamic:true}) : null})
        .setDescription(`${error} (${error.code ? error.code : ""})`);

        client.lastError = Date.now();

        channel.send({
            embeds: [embed]
        });
    }
}