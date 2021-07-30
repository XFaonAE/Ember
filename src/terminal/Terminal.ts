import chalk from "chalk";
import Stdin from "./Stdin";

export default class Terminal {
    public stdin: Stdin = new Stdin()
    public charset: any = {logIcon: "•"}

    public log(message: string) {
        console.info(chalk.rgb(116, 189, 221)(this.charset.logIcon) + "  " + message)
    }

    public error(message: string) {
        console.error(chalk.hex("#ff5555")(this.charset.logIcon) + "  " + message)
    }

    public warning(message: string) {
        console.warn(chalk.hex("#ffff55")(this.charset.logIcon) + "  " + message)
    }
}