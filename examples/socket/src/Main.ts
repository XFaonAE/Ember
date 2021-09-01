import { terminal } from "../../../src/Main";

terminal.hr();

terminal.stdin.read("HIII", "uwu", (ans: any) => {
    terminal.setPrefix(terminal.hex("#50ffab", "| Answer |"));
    terminal.log(ans);
});