module.exports = class InteractionCreate {

    constructor(client) {
        this.client = client;
    }

    async run(interaction) {

        // Introducing constants
        const client = this.client;
        const emojis = client.emojiList;

        // Check if user is in a server
        if(!interaction.guildId) return;

        // Run command
        if(interaction.isChatInputCommand()) {
            const cmd = client.cmds.get(interaction.commandName);

            // Verify is the command is owner only
            if(cmd.settings.restriction) {
                const rest = cmd.settings.restriction;
                if(rest.includes("OWNER") && !client.cfg.owner.includes(interaction.user.id)) return interaction.reply(`${emojis.error} \`T'es qui ?\``);
            };

            if(cmd.runInteraction) cmd.runInteraction(interaction);
            else cmd.run(interaction, []);
            client.logger.command(interaction.guild.name, interaction.user.username, interaction.commandName, "slash");
        }
    }
}