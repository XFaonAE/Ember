import chalk from "chalk";
import Stdin from "./Stdin";
import Tag from "./Tag";

export default class Terminal {
    public stdin: Stdin = new Stdin();
    public tag: Tag = new Tag();
    public charset: any = { logIcon: "•" };

    public log(message: string) {
        console.info(chalk.hex("#74bddd")(this.charset.logIcon) + "  " + message)
    }

    public error(message: string) {
        console.error(chalk.hex("#ff5555")(this.charset.logIcon) + "  " + message)
    }

    public success(message: string) {
        console.log(chalk.hex("#50ffab")(this.charset.logIcon) + "  " + message)
    }

    public warning(message: string) {
        console.warn(chalk.hex("#ffff55")(this.charset.logIcon) + "  " + message)
    }

    public hex(hex: string, text: string) {
        return chalk.hex(hex)(text);
    }

    public bgHex(hex: string, text: string) {
        return chalk.bgHex(hex)(text);
    }
}