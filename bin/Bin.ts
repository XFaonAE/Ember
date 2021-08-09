#!/usr/bin/env node

import { command, terminal } from "../src/Main";
import Gui from "./gui/Gui";

const row = (key: string, value: string) => {
    terminal.row(key, value);
}

const execute = (commandName: string, handle: any, args: string[], flags: any) => {
    if (handle[commandName] !== undefined) {
        handle[commandName](args, flags);
        return;
    }

    terminal.error(`Unknown command "${commandName}", use "help" to get help`);
}

command.on("run", (args: string[]) => {
    switch (args[0]) {
        case "gui":
            row("gui init", "Initialize a new GUI application");
            row("gui dev", "Start a development server for the current GUI application");
            row("gui build", "Build the current GUI application");
            break;

        default: 
            row("help gui", "Command's for GUI programming");
            break;
    }
}, { triggers: [ "help", "" ] });

command.on("run", (args: string[], flags: any) => {
    execute(args[0], new Gui(), args, flags);
}, { triggers: [ "gui" ] })

command.setInputMode("process");
