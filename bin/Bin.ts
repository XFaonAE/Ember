#!/usr/bin/env node

import { command, macros, terminal } from "../src/Main";
import Gui from "./gui/Gui";

macros.add("bin:Bin UnknownCommand", (bin: string) => {
    terminal.error(`Unknown command, use "help ${ bin }" to get a list of available commands`);
});

const row = (key: string, value: string) => {
    terminal.row(key, value);
}

command.on("run", (args: string[]) => {
    switch (args[0]) {
        case "gui":
            row(" gui init", "Initialize a new GUI application");
            row("  gui dev", "Start a development server for the current GUI application");
            row("gui build", "Build the current GUI application");
            break;

        default: 
            row("help gui", "Command's for GUI programming");
            break;
    }
}, { triggers: [ "help", "" ] });

new Gui();

command.setInputMode("process", {
    flag: {
        parseBoolean: true,
        default: "yee"
    }
});
