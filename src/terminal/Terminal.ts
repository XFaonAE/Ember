import chalk from "chalk";
import Stdin from "./Stdin";
import Tag from "./Tag";

export default class Terminal {
    public stdin: Stdin = new Stdin();
    public tag: Tag = new Tag();
    public charset: any = { logIcon: "•" };
    public prefix? = "";

    public log(message: string) {
        console.info(this.prefix + (this.prefix ? "  " : "") + chalk.hex("#74bddd")(this.charset.logIcon) + "  " + message)
    }

    public error(message: string) {
        console.error(this.prefix + (this.prefix ? "  " : "") + chalk.hex("#ff5555")(this.charset.logIcon) + "  " + message)
    }

    public success(message: string) {
        console.log(this.prefix + (this.prefix ? "  " : "") + chalk.hex("#50ffab")(this.charset.logIcon) + "  " + message)
    }

    public warning(message: string) {
        console.warn(this.prefix + (this.prefix ? "  " : "") + chalk.hex("#ffff55")(this.charset.logIcon) + "  " + message)
    }

    public hex(hex: string, text: string) {
        return chalk.hex(hex)(text);
    }

    public bgHex(hex: string, text: string) {
        return chalk.bgHex(hex)(text);
    }

    public row(key: string, value: string) {
        console.log(this.prefix + " " + this.hex("#74bddd", key) + "  -  " + value)
    }

    public setPrefix(prefix: string) {
        this.prefix = prefix;
    }
}