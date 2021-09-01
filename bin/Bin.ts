#!/usr/bin/env node

import { command, terminal } from "../src/Main";
import General from "./general/General";
import Gui from "./gui/Gui";
import fs from "fs";
import path from "path";

/**
 * Short hand row function
 * @param key Key value
 * @param value Value pair
 */
const row = (key: string, value: string) => {
    terminal.row(key, value);
}

// Execute a grouped command
const execute = (commandName: string = "help", handle: any, args: string[], flags: any) => {
    // Find a matching method for this command and run it
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
    execute(args[0], new General(), args, flags);
}, { triggers: [ "general" ] });

command.on("run", (args: string[], flags: any) => {
    execute(args[0], new Gui(), args, flags);
}, { triggers: [ "gui" ] });

command.on("run", (args: string[], flags: any) => {
    import(path.join(process.cwd(), "./ember.config.js")).then((projectConfig: any) => {
        projectConfig = projectConfig.default;

        switch (projectConfig.type) {
            case "general":
                new General().dev(args, flags);
                break;

            case "gui":
                new Gui().dev(args, flags);
                break;

            default: 
                terminal.error("Invalid project type in ember.config.ts");
                break;
        } 
    }).catch((error: any) => {
        terminal.error("Project config does not exist: \"ember.config.ts\"");
    });
}, { triggers: [ "dev" ] });

// Set cli interface mode
command.setInputMode("process");
