import { terminal } from "../../../src/Main"

terminal.stdin.read("HIII", "uwu", (ans: any) => {
	terminal.setPrefix(terminal.hex("#50ffab", "| Answer |"))
	terminal.log(ans)
})  