import { command } from "../src/Main";

command.on("run", (args: string[], flags: any) => {
    console.log("[ TEST ] Command executed");
    console.log(args, flags)
}, {
    triggers: [
        "test",
        "t"
    ]
});

const commandData = command.parse("test Hello-World! --flag=value --flagNext=next-flag --flag2 -flag3");

if (commandData) {
    command.run(commandData.trigger, commandData.args, commandData.flags);
}
