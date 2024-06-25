module.exports = class Command {
	constructor(client, {
		name = null,
		aliases = new Array(),
		enabled = true,
		userPerms = new Array(),
		restriction = new Array(),
		slashCommandOptions = null
	})
	{
		this.client = client;
		this.settings = { enabled, userPerms, restriction};
		this.help = { name, aliases };
		this.slashCommandOptions = slashCommandOptions && {
            options: slashCommandOptions.options || [],
            description: slashCommandOptions.description
        };
	}
};