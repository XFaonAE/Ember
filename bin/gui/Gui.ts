import { command, macros, terminal } from "../../src/Main";

export default class Gui {
    public constructor() {
        command.on("run", (args: string[], flags: any) => {
            switch (args[0]) {
                case "dev":
                    this.dev(args, flags);
                    break;

                default:
                    macros.run("bin:Bin UnknownCommand", "gui");
                    break;
            }
        }, { triggers: [ "gui" ] });
    }

    public dev(args: string[], flags: any) {
        terminal.log("Starting dev server");
        console.log(args, flags);
    }
}