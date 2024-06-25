const { EmbedBuilder } = require("discord.js");
const { createAudioResource } = require("@discordjs/voice");

module.exports = class MessageCreate {

    constructor(client) {
        this.client = client;
    }

    async run(message) {

        const client = this.client;

        // Verify that user is not a bot and that there is a guild
        if(message.author.bot || !message.guild) return;

        // @someone
        if(message.content === "@someone") {
            const randomUser = message.guild.members.cache.random(1)[0].user;

            const someoneEmbed = new EmbedBuilder()
                .setFooter({text: "ID: " + randomUser.id})
                .setColor("#0000FF")
                .setAuthor({
                    name: randomUser.username, 
                    iconURL: randomUser.displayAvatarURL({dynamic:true})
                });
            
            message.reply({
                embeds: [someoneEmbed]
            });
        };

        //@Soundboard - Bot
        if(message.content === `<@${client.cfg.botId}>`) message.reply(`Yep ? P'tit ping de **${client.ws.ping} ms**`);

        // Check if message is a command
        const prefix = client.cfg.prefix;
        if(!message.content.startsWith(prefix)) return;

        // Slice args, name
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmdName = args.shift().toLowerCase();
        const cmd = client.cmds.get(cmdName) || client.cmds.get(client.aliases.get(cmdName));
        const emojis = client.emojiList;

        // Check if user is in cooldown
        const cooldownTime = client.cooldownTime;
        if(client.cooldowns.get(message.author.id) && message.createdTimestamp < (client.cooldowns.get(message.author.id) + cooldownTime)) return message.reply(`${emojis.error} T'es en cooldown :shrug: (\`${client.functions.convertMS((client.cooldowns.get(message.author.id) + cooldownTime) - message.createdTimestamp)}\`)`);
        client.cooldowns.set(message.author.id, message.createdTimestamp)

        // Try to run command
        if(cmd) {
            // Warn about s!command validity
            message.channel.send(`${emojis.warn} | Utilise des **/** commandes plutot : \`/${cmdName}${args.length > 0 ? " " + args : ""}\``);

            // Ensure that the command is enabled
            if(!cmd.settings.enabled) return message.reply(`${emojis.error} \`La commande est désactivée :/\``);

            // Verify user permissions
            if(cmd.settings.userPerms) {
                let neededPerms = [];

                await cmd.settings.userPerms.forEach((perm) => {
                    if(!message.channel.permissionsFor(message.member).serialize[perm]) neededPerms.push(perm);
                });

                if(neededPerms.length > 1) {
                    return message.reply(`${emojis.error} Tu n'as pas les permissions ${neededPerms.map((p) => `\`${p}\``).join(", ")}`);
                } else if(neededPerms.length == 1){
                    return message.reply(`${emojis.error} Tu n'as pas la permission \`${neededPerms[0]}\``);
                };
            };

            // Verify is the command is owner only
            if(cmd.settings.restriction) {
                const rest = cmd.settings.restriction;
                if(rest.includes("OWNER") && !client.cfg.owner.includes(message.author.id)) return message.reply(`${emojis.error} \`T'es qui ?\``);
            };

            cmd.run(message, args);
            client.logger.command(message.guild.name, message.author.username, message.content);
        } else {
            try {            
                let nameInSics = client.sics.get(cmdName);
                if(nameInSics) {
                    // Check if user is in a voice channel
                    var voiceChannel = message.member.voice.channel;
                    if(!voiceChannel) return message.reply(`${emojis.error} \`Tu dois être dans un salon vocal batard !\``);

                    // Check if the bot is in a voice channel
                    if(!message.guild.members.cache.get(client.user.id).voice.channel) return message.reply(`${emojis.idle} \`J'suis pas en vocal mon chleb !\``);

                    let toPlay = createAudioResource(`./musics/${cmdName}.mp3`);
                    client.player.play(toPlay);
                    return message.reply(`${emojis.voice} Ca part pour \`${cmdName}.mp3\``);
                } else return message.reply(`${emojis.error} Ca existe pas bouffon: \`${prefix}help\`, si t'es perdu.`);
            } catch(error) {
                console.log("Error: " + error)
            };
        }
    }
}