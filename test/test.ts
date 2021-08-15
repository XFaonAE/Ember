import { command } from "../src/Main";

command.on("run", (args: string[], flags: any) => {
    console.log(args, flags);
}, {
    triggers: [ "t", "test" ]
});

command.setInputMode("process");
console.log("E");