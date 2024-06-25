const Command = require("../Commands");
const { EmbedBuilder } = require("discord.js");
module.exports = class Whois extends Command {

    constructor(client) {
        super(client, {
            name: "whois",
            aliases: ["userinfo", "ui"],
            enabled: true,
            userPerms: [],
            restriction: [],
            slashCommandOptions: {
                description: "Ptdr t ki ?",
                options: [
                    {
                        type: "user",
                        required: false,
                        description: "the user about who you want infos",
                        name: "user"
                    }
                ]
            }
        })
    }

    async run(message, args) {

        let client = this.client;

        const user = message.mentions.users.first() || (args[0] ? await client.users.fetch(args[0]) : message.author) || message.author;
        const member = await message.guild.members.cache.get(user.id);

        let badges = [];
        let presence = null;

        if(!user.bot) for (const [badge, value] of Object.entries(user.flags.serialize())) {
            if(value && client.emojiList.badges[badge]) badges.push(client.emojiList.badges[badge]);
        };

        if(member && member.premiumSince != null) badges.push(client.emojiList.badges["Nitro"]);
        if(member) presence = member.presence;

        const st = presence ? presence.status : null;

        let clientStatus = presence ? presence.clientStatus : null;
        let plateformes = [];

        if(st && st !== "offline" && !user.bot) {
            if (clientStatus && clientStatus.mobile) plateformes.push("`📱`")
            if (clientStatus && clientStatus.desktop) plateformes.push("`💻`");
            if (clientStatus && clientStatus.web) plateformes.push("`🌐`");
        };

        if(plateformes.length === 0 && user.bot) plateformes.push("`🤖`")

        const embed = new EmbedBuilder()
        .setAuthor({name: user.globalName, iconURL: user.displayAvatarURL({ dynamic: true })})
        .setFooter({text:"Whois | Soundboard - Bot"})
        .setDescription(`Badges discord: ${badges.length === 0 ? "`" + "Aucun badges" + "`" : (badges.length === 1 ? badges[0] : badges.join(", "))} \n${plateformes.length !== 0 ? "Plateforme(s):" : ""} ${plateformes.length !== 0 ? (plateformes.length === 1 ? plateformes[0] : plateformes.join(" + ")) : ""}`)
        .setColor("#A020F0")
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields({name:":label: • Nom", value:user.username, inline:true})
        .addFields({name:client.emojiList.id + " • ID", value:"||" + user.id + "||", inline:true})
        .addFields({name:":calendar: • Crée", value:`${client.functions.printDateFrom(user.createdAt)}`, inline:true})
        .addFields({name:":robot: • Robot", value:user.bot ? client.emojiList.success : client.emojiList.error, inline:true})
        
        if(member) {
            embed.addFields({name:":calendar: • Rejoint", value:`${client.functions.printDateFrom(member.joinedAt)}`, inline:true})
            if(st != null) embed.addFields({name:client.emojiList[(st ? st : "dnd")] + "• Status", value:st, inline:true});
            embed.addFields({name:client.emojiList.up + " • Rôle le plus haut", value:`${member.roles.highest}`, inline:true})
            .addFields({name:`${client.emojiList.roleList} • Rôles (${member.roles.cache.filter(role => role.id !== message.guild.roles.everyone.id).size})`, value:`${member.roles.cache.filter(role => role.id !== message.guild.roles.everyone.id).size !== 0 ? (member.roles.cache.size > 10 ? member.roles.cache.filter(role => role.id !== message.guild.roles.everyone.id).map((r) => r).slice(0, 9).join(", ")+" " + "Et encore plus..." : member.roles.cache.filter(role => role.id !== message.guild.roles.everyone.id).map((r) => r).join(", ")) : "Aucun rôles"}`, inline:false})
        };

        return message.reply({
            embeds: [embed]
        });
    };

    async runInteraction(interaction) {

        const client = this.client;

        let user = interaction.options.getUser("user");
        if(!user) user = interaction.user;
        const member = await interaction.guild.members.cache.get(user.id);

        let badges = [];
        let presence = null;

        if(!user.bot) for (const [badge, value] of Object.entries(user.flags.serialize())) {
            if(value && client.emojiList.badges[badge]) badges.push(client.emojiList.badges[badge]);
        };

        if(member && member.premiumSince != null) badges.push(client.emojiList.badges["Nitro"]);
        if(member) presence = member.presence;

        const st = presence ? presence.status : null;

        let clientStatus = presence ? presence.clientStatus : null;
        let plateformes = [];

        if(st != null && st !== "offline" && !user.bot) {
            if (clientStatus && clientStatus.mobile) plateformes.push("`📱`")
            if (clientStatus && clientStatus.desktop) plateformes.push("`💻`");
            if (clientStatus && clientStatus.web) plateformes.push("`🌐`");
        };

        if(plateformes.length === 0 && user.bot) plateformes.push("`🤖`")

        const embed = new EmbedBuilder()
        .setAuthor({name: user.globalName, iconURL: user.displayAvatarURL({ dynamic: true })})
        .setFooter({text:"Whois | Soundboard - Bot"})
        .setDescription(`Badges discord: ${badges.length === 0 ? "`" + "Aucun badges" + "`" : (badges.length === 1 ? badges[0] : badges.join(", "))} \n${plateformes.length !== 0 ? "Plateforme(s):" : ""} ${plateformes.length !== 0 ? (plateformes.length === 1 ? plateformes[0] : plateformes.join(" + ")) : ""}`)
        .setColor("#A020F0")
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields({name:":label: • Nom", value:user.username, inline:true})
        .addFields({name:client.emojiList.id + " • ID", value:"||" + user.id + "||", inline:true})
        .addFields({name:":calendar: • Crée", value:`${client.functions.printDateFrom(user.createdAt)}`, inline:true})
        .addFields({name:":robot: • Robot", value:user.bot ? client.emojiList.success : client.emojiList.error, inline:true})
        
        if(member) {
            embed.addFields({name:":calendar: • Rejoint", value:`${client.functions.printDateFrom(member.joinedAt)}`, inline:true});
            if(st != null) embed.addFields({name:client.emojiList[(st ? st : "dnd")] + "• Status", value:st, inline:true});
            embed.addFields({name:client.emojiList.up + " • Rôle le plus haut", value:`${member.roles.highest}`, inline:true})
            .addFields({name:`${client.emojiList.roleList} • Rôles (${member.roles.cache.filter(role => role.id !== interaction.guild.roles.everyone.id).size})`, value:`${member.roles.cache.filter(role => role.id !== interaction.guild.roles.everyone.id).size !== 0 ? (member.roles.cache.size > 10 ? member.roles.cache.filter(role => role.id !== interaction.guild.roles.everyone.id).map((r) => r).slice(0, 9).join(", ")+" " + "Et encore plus..." : member.roles.cache.filter(role => role.id !== interaction.guild.roles.everyone.id).map((r) => r).join(", ")) : "Aucun rôles"}`, inline:false});
        };

        return interaction.reply({
            embeds: [embed]
        });
    };
}