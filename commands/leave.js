const Command = require("../Commands");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = class Leave extends Command {

    constructor(client) {
        super(client, {
            name: "leave",
            aliases: ["get-out"],
            enabled: true,
            userPerms: [],
            restriction: [],
            slashCommandOptions: {
                description: "Ouais bah casse toi !"
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
        
        // Get the connection
        if(message.guild.members.cache.get(client.user.id).voice.channel != null) {
            const connection = await getVoiceConnection(message.guild.id);
            if(connection) connection.destroy();
            else message.guild.members.cache.get(client.user.id).voice.disconnect();
            
            return message.reply(`${emojis.dnd} \`Allez, des gros bisous !\``)
        } else return message.reply({content:`${emojis.idle} \`J'suis pas connecté mon chleb !\``});
    }
}