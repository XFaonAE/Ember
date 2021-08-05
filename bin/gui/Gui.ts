import { command, terminal } from "../../src/Main";

export default class Gui {
    public constructor() {
        command.on("run", (args: string[], flags: any) => {
            try {
                eval(`this.${args[0]}(${args}, ${flags});`);
            } catch (error: any) {
                terminal.error(`The command "gui ${args[0]}" does not exist, use "help gui" to get a list of available commands`)
            }
        }, { triggers: [ "gui" ] });
    }

    public dev(args: string[], flags: any) {
        terminal.log("Starting dev server");
        console.log(args, flags);
    }
}