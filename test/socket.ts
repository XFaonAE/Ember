import { command, terminal } from "../src/Main";

command.on("run", (args: string[], flags: any) => {
    console.log("[ TEST ] Command executed");
    console.log(args, flags)
}, {
    triggers: [
        "test",
        "t"
    ]
});

command.on("run", (args: string[], flags: any) => {
    terminal.log("Help: ");
}, {
    triggers: [ "", "help" ]
});

command.setInputMode("npm-bin");