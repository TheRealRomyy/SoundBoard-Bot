const { createAudioPlayer } = require("@discordjs/voice");
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const util = require("util");

const readdir = util.promisify(fs.readdir);


class Soundboard extends Client {

    constructor(option) {
        super(option);
        // Settings
        this.player = createAudioPlayer();
        this.cooldownTime = 2000;

        // All Collections
        this.sics = new Collection();
        this.cooldowns = new Collection();
        this.cmds = new Collection;
        this.aliases = new Collection();

        // Import
        this.emojiList = require("./emojis.json");
        this.cfg = require("./config.json");
        this.functions = require("./helpers/functions");
        this.logger = new (require("./helpers/logger"))(this);
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