#!/usr/bin/env node

import { command, terminal } from "../src/Main";
import Gui from "./gui/Gui";

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

command.setInputMode("npm-bin");
