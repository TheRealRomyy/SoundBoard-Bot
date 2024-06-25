const Command = require("../Commands");
const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = class Join extends Command {

    constructor(client) {
        super(client, {
            name: "join",
            aliases: ["come"],
            enabled: true,
            userPerms: [],
            restriction: [],
            slashCommandOptions: {
                description: "Viens la bébou !"
            }
        })
    }

    async run(message, args) {

        // Introducing constants
        const client = this.client;
        const emojis = client.emojiList;

        // Check if user is in a voice channel
        var voiceChannel = message.member.voice.channel;
        if(!voiceChannel) return message.reply(`${emojis.error} \`Tu dois être dans un salon vocal batard !\``);

        // Check if the bot is already is the voice channel
        if(message.guild.members.cache.get(client.user.id).voice.channel && message.guild.members.cache.get(client.user.id).voice.channel.id == voiceChannel.id) return message.reply(`${emojis.idle} \`J'suis déjà là !\``);
        
        joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: message.member.guild.id,
            adapterCreator: message.member.guild.voiceAdapterCreator
        }).subscribe(client.player);

        return message.reply(`${emojis.online} \`J'suis la\``)
    }
}