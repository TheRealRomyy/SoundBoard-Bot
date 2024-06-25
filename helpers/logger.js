const chalk = require("chalk");

class Logger {

    constructor(client) {
        this.client = client;
    };

    log(info) {
        console.log(`[${new Date().toLocaleDateString()}] [${new Date().toLocaleTimeString()}] [${chalk.blue("INFO")}] ${info}`);
    };

    warn(warn) {
        console.warn(`[${new Date().toLocaleDateString()}] [${new Date().toLocaleTimeString()}] [${chalk.yellow("WARN")}] ${warn}`);
    };

    error(err) {
        console.error(`[${new Date().toLocaleDateString()}] [${new Date().toLocaleTimeString()}] [${chalk.red("ERROR")}] ${err}`);
    };

    command(guild, author, command, type="cmd") {
        console.log(`[${new Date().toLocaleDateString()}] [${new Date().toLocaleTimeString()}] [${type === "cmd" ? "CMD" : "SLASH CMD"}] Guild: ${guild} | Author: ${author} => ${command}`);
    };

    loaded(name, type, error=null) {

        let typeStr = null;
        let text = null;

        switch(type) {
            case "command":
                typeStr = "Command"
                text = "sucessfully loaded"
                break;
            case "event":
                typeStr = "Event"
                text = "sucessfully loaded"
                break;
            case "command-unload":
                typeStr= "Command"
                text = "unloaded"
                break;
        };

        console.log(`${typeStr}: '${name}' ${error == null ? `was ${text}` : `can't be loaded: ${error}`}`);
    };
};

module.exports = Logger;