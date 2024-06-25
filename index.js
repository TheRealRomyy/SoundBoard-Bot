const { createAudioPlayer } = require("@discordjs/voice");
const { Client, GatewayIntentBits, Collection, Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");
const util = require("util");

const readdir = util.promisify(fs.readdir);

class Soundboard extends Client {

    constructor(option) {
        super(option);
        // Settings
        this.player = createAudioPlayer();
        this.cooldownTime = 2000;

        // All Collections & arrays
        this.sics = new Collection();
        this.cooldowns = new Collection();
        this.cmds = new Collection;
        this.aliases = new Collection();
        this.slashCmds = new Array();

        // Import
        this.emojiList = require("./emojis.json");
        this.cfg = require("./config.json");
        this.functions = require("./helpers/functions");
        this.logger = new (require("./helpers/logger"))(this);

        // (/) commands
        this.newRest = new REST({ version: '10' }).setToken(this.cfg.token);
    };

    async init() {
        // Soundboard loading (sics collection)
        const dir = await readdir("./musics/");
        dir.filter((mus) => mus.split(".").pop() === "mp3").forEach((mus) => {
            this.sics.set(mus.split(".")[0], "./musics/"+mus);
        });

        // Commands loading (cmds collection)
        const commands = await readdir("./commands/");
        commands.filter((cmd) => cmd.split(".").pop() === "js").forEach((cmd) => {
            try {
                const props = new(require(`./commands/${cmd}`))(this);
                this.logger.log(`Command '${cmd}' successfully loaded`);
                if(props.init) props.init(this);
                this.cmds.set(props.help.name, props);
                if(props.slashCommandOptions) {
                    this.logger.log(`SlashCommand '${cmd}' successfully loaded`);
                    const slashCmd = new SlashCommandBuilder()
                    .setName(props.help.name)
                    .setDescription(props.slashCommandOptions.description)
                    if(props.slashCommandOptions.options.length > 0) {
                        props.slashCommandOptions.options.forEach(opt => {
                            if(opt.type == "string") slashCmd.addStringOption(option =>
                                option.setName(opt.name)
                                .setDescription(opt.description)
                                .setRequired(opt.required)
                            );
                        });
                    }
                    this.slashCmds.push(slashCmd);
                }
                props.help.aliases.forEach((alias) => {
                    this.aliases.set(alias, props.help.name);
                });
            } catch (e) {
                this.logger.error(`Command '${cmd}' encoutred an issues: ${e}`);
            };
        });

        // Event loading
        const evtFiles = await readdir("./events/");
        evtFiles.forEach((file) => {
            const eventName = file.split(".")[0];
            const event = new (require(`./events/${file}`))(this);
            this.logger.log(`Event '${eventName}' successfully loaded`);
            this.on(eventName, (...args) => event.run(...args));
            delete require.cache[require.resolve(`./events/${file}`)];
        }); 

        // Refreshing application (/) commands
        try {
            this.logger.log("Starting refreshing application (/) commands");

            await this.newRest.put(Routes.applicationGuildCommands(this.cfg.botId, this.cfg.mainGuildIdea), {
                body: this.slashCmds
            });
        } catch(e) {
            this.logger.error(`Error while refreshing (/) commands : ${e}`);
        }

        this.login(client.cfg.token)
    };
};

const client = new Soundboard({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildPresences
    ]
});
client.init();